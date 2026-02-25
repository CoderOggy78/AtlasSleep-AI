import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Brain, Activity, Heart, Droplet, Weight, Calendar, Cigarette, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ClinicalDataForm = ({ datasetId, onPredictionComplete }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clinicalData, setClinicalData] = useState({
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    blood_sugar: '',
    hba1c: '',
    cholesterol_total: '',
    cholesterol_ldl: '',
    cholesterol_hdl: '',
    bmi: '',
    weight: '',
    age: '',
    smoking: false,
    family_history: []
  });
  const [familyHistoryInput, setFamilyHistoryInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert empty strings to null
      const cleanedData = Object.entries(clinicalData).reduce((acc, [key, value]) => {
        if (key === 'family_history') {
          acc[key] = value;
        } else if (key === 'smoking') {
          acc[key] = value;
        } else {
          acc[key] = value === '' ? null : parseFloat(value);
        }
        return acc;
      }, {});

      const response = await axios.post(
        `${API}/predict-diseases`,
        {
          dataset_id: datasetId,
          clinical_data: cleanedData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Disease risk prediction complete!');
      onPredictionComplete(response.data);
    } catch (error) {
      toast.error('Prediction failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const addFamilyHistory = () => {
    if (familyHistoryInput.trim()) {
      setClinicalData({
        ...clinicalData,
        family_history: [...clinicalData.family_history, familyHistoryInput.trim()]
      });
      setFamilyHistoryInput('');
    }
  };

  const removeFamilyHistory = (index) => {
    setClinicalData({
      ...clinicalData,
      family_history: clinicalData.family_history.filter((_, i) => i !== index)
    });
  };

  return (
    <Card data-testid="clinical-data-form" className="bg-card border border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Clinical Data Input
        </CardTitle>
        <CardDescription>
          Provide your health metrics for comprehensive disease risk analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blood Pressure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Pressure (Systolic)</Label>
              <div className="relative">
                <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="120"
                  className="pl-10"
                  value={clinicalData.blood_pressure_systolic}
                  onChange={(e) => setClinicalData({...clinicalData, blood_pressure_systolic: e.target.value})}
                />
              </div>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </div>
            <div className="space-y-2">
              <Label>Blood Pressure (Diastolic)</Label>
              <div className="relative">
                <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="80"
                  className="pl-10"
                  value={clinicalData.blood_pressure_diastolic}
                  onChange={(e) => setClinicalData({...clinicalData, blood_pressure_diastolic: e.target.value})}
                />
              </div>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </div>
          </div>

          {/* Blood Sugar & HbA1c */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Sugar</Label>
              <div className="relative">
                <Droplet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="100"
                  className="pl-10"
                  value={clinicalData.blood_sugar}
                  onChange={(e) => setClinicalData({...clinicalData, blood_sugar: e.target.value})}
                />
              </div>
              <p className="text-xs text-muted-foreground">mg/dL</p>
            </div>
            <div className="space-y-2">
              <Label>HbA1c</Label>
              <div className="relative">
                <Droplet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="5.5"
                  className="pl-10"
                  value={clinicalData.hba1c}
                  onChange={(e) => setClinicalData({...clinicalData, hba1c: e.target.value})}
                />
              </div>
              <p className="text-xs text-muted-foreground">%</p>
            </div>
          </div>

          {/* Cholesterol */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Cholesterol Levels</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Total</Label>
                <Input
                  type="number"
                  placeholder="200"
                  value={clinicalData.cholesterol_total}
                  onChange={(e) => setClinicalData({...clinicalData, cholesterol_total: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">LDL</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={clinicalData.cholesterol_ldl}
                  onChange={(e) => setClinicalData({...clinicalData, cholesterol_ldl: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">HDL</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={clinicalData.cholesterol_hdl}
                  onChange={(e) => setClinicalData({...clinicalData, cholesterol_hdl: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
            </div>
          </div>

          {/* BMI & Weight */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>BMI</Label>
              <div className="relative">
                <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="25.0"
                  className="pl-10"
                  value={clinicalData.bmi}
                  onChange={(e) => setClinicalData({...clinicalData, bmi: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Weight</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="70"
                value={clinicalData.weight}
                onChange={(e) => setClinicalData({...clinicalData, weight: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">kg</p>
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="35"
                  className="pl-10"
                  value={clinicalData.age}
                  onChange={(e) => setClinicalData({...clinicalData, age: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Smoking */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smoking"
              checked={clinicalData.smoking}
              onCheckedChange={(checked) => setClinicalData({...clinicalData, smoking: checked})}
            />
            <Label htmlFor="smoking" className="flex items-center gap-2 cursor-pointer">
              <Cigarette className="w-4 h-4" />
              Smoking
            </Label>
          </div>

          {/* Family History */}
          <div className="space-y-2">
            <Label>Family History</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Diabetes, Hypertension"
                value={familyHistoryInput}
                onChange={(e) => setFamilyHistoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFamilyHistory())}
              />
              <Button type="button" onClick={addFamilyHistory} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {clinicalData.family_history.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {clinicalData.family_history.map((condition, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm flex items-center gap-2"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeFamilyHistory(index)}
                      className="text-primary hover:text-primary/70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Disease Risk Prediction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClinicalDataForm;