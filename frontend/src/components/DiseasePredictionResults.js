import { motion } from 'framer-motion';
import { Heart, Brain as BrainIcon, Activity, Moon, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DiseasePredictionResults = ({ prediction }) => {
  if (!prediction) return null;

  const getRiskColor = (percentage) => {
    if (percentage >= 70) return 'text-red-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskBgColor = (percentage) => {
    if (percentage >= 70) return 'bg-red-500/20 border-red-500/40';
    if (percentage >= 40) return 'bg-yellow-500/20 border-yellow-500/40';
    return 'bg-green-500/20 border-green-500/40';
  };

  const getRiskLabel = (percentage) => {
    if (percentage >= 70) return 'High Risk';
    if (percentage >= 40) return 'Moderate Risk';
    return 'Low Risk';
  };

  const diseaseIcons = {
    'Cardiovascular Disease': Heart,
    'Type 2 Diabetes / Metabolic Syndrome': Activity,
    'Sleep Apnea': Moon,
    'Depression / Anxiety': BrainIcon,
    'Cognitive Decline': BrainIcon
  };

  return (
    <div className="space-y-6" data-testid="disease-prediction-results">
      {/* Overall Risk Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-heading">
              Overall Health Risk Score
            </CardTitle>
            <CardDescription className="text-center">
              Based on sleep patterns and clinical data analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - prediction.overall_risk_score / 100)}`}
                    className={getRiskColor(prediction.overall_risk_score)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-heading font-bold ${getRiskColor(prediction.overall_risk_score)}`}>
                    {prediction.overall_risk_score.toFixed(0)}
                  </span>
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4 max-w-md">
                {prediction.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Warnings */}
      {prediction.warnings && prediction.warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert className="bg-red-500/10 border-red-500/40">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <AlertDescription>
              <div className="font-semibold mb-2">Urgent Health Warnings</div>
              <ul className="space-y-1">
                {prediction.warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm">• {warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Individual Disease Risks */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Disease Risk Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prediction.risks && prediction.risks.map((risk, index) => {
            const Icon = diseaseIcons[risk.disease] || Activity;
            return (
              <motion.div
                key={risk.disease}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className={`${getRiskBgColor(risk.risk_percentage)} border`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {risk.disease}
                      </CardTitle>
                      <span className={`text-2xl font-heading font-bold ${getRiskColor(risk.risk_percentage)}`}>
                        {risk.risk_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <CardDescription className="text-xs">
                      {getRiskLabel(risk.risk_percentage)} • Confidence: {(risk.confidence * 100).toFixed(0)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Progress value={risk.risk_percentage} className="h-2" />
                    </div>
                    
                    {/* Key Factors */}
                    <div>
                      <div className="text-xs font-semibold mb-1 text-muted-foreground">Key Contributing Factors:</div>
                      <ul className="space-y-1">
                        {risk.key_factors.map((factor, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-1">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <div className="text-xs font-semibold mb-1 text-muted-foreground">Recommendations:</div>
                      <ul className="space-y-1">
                        {risk.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <Alert className="bg-blue-500/10 border-blue-500/40">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> These predictions are probabilistic risk assessments based on AI analysis and are not medical diagnoses. 
          Please consult with healthcare professionals for proper medical evaluation and treatment, especially for high-risk indicators.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DiseasePredictionResults;