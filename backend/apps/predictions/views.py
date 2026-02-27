from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from core.utils import extract_text_from_pdf

from .models import Prediction
from .serializers import (
    PredictionSerializer,
    ResumeUploadSerializer,
    SkillPredictionRequestSerializer,
)
from .services import predict_role_from_text


@method_decorator(csrf_exempt, name='dispatch')
class PredictFromSkillsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = SkillPredictionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        skills = serializer.validated_data.get("skills", [])
        text = " ".join(skills)

        result = predict_role_from_text(text)

        prediction = Prediction.objects.create(
            user=request.user,
            input_skills=skills,
            predicted_role=result.role,
            confidence=result.confidence,
        )

        return Response(
            PredictionSerializer(prediction).data,
            status=200
        )


@method_decorator(csrf_exempt, name='dispatch')
class PredictFromResumeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        print("User:", request.user)
        print("Authenticated:", request.user.is_authenticated)
        print("Data:", request.data)
        
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume = serializer.validated_data["resume"]
        resume_text = extract_text_from_pdf(resume)
        result = predict_role_from_text(resume_text)

        prediction = Prediction.objects.create(
            user=request.user,
            resume_file=resume,
            resume_text=resume_text,
            predicted_role=result.role,
            confidence=result.confidence,
        )
        return Response(PredictionSerializer(prediction).data, status=status.HTTP_201_CREATED)


class PredictionHistoryView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PredictionSerializer

    def get_queryset(self):
        return Prediction.objects.filter(user=self.request.user)


class PredictionListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PredictionSerializer

    def get_queryset(self):
        return Prediction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AllPredictionHistoryView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PredictionSerializer

    def get_queryset(self):
        return Prediction.objects.all().order_by('-created_at')
