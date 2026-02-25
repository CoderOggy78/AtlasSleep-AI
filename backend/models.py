from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid
import re

# User Models
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: str

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    profile_image: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)
    
    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    password_hash: str
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Sleep Data Models
class SleepRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    start: Optional[str] = None
    end: Optional[str] = None
    sleep_quality: Optional[str] = None
    time_in_bed: Optional[str] = None
    heart_rate: Optional[float] = None
    steps: Optional[int] = None
    snore_time: Optional[float] = None
    movements_per_hour: Optional[float] = None
    regularity: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Dataset(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    record_count: int
    upload_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    columns: List[str]

class AnalysisRequest(BaseModel):
    dataset_id: str
    analysis_type: str = "comprehensive"

class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    dataset_id: str
    user_id: str
    insights: str
    sleep_score: float
    quality_trend: str
    recommendations: List[str]
    phenotype: str
    explainability: Dict[str, Any]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Disease Prediction Models
class ClinicalData(BaseModel):
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    blood_sugar: Optional[float] = None
    hba1c: Optional[float] = None
    cholesterol_total: Optional[float] = None
    cholesterol_ldl: Optional[float] = None
    cholesterol_hdl: Optional[float] = None
    bmi: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    smoking: bool = False
    family_history: List[str] = []

class DiseasePredictionRequest(BaseModel):
    dataset_id: str
    clinical_data: Optional[ClinicalData] = None

class DiseaseRisk(BaseModel):
    disease: str
    risk_percentage: float
    confidence: float
    key_factors: List[str]
    recommendations: List[str]

class DiseasePredictionResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    dataset_id: str
    overall_risk_score: float
    risks: List[DiseaseRisk]
    summary: str
    warnings: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))