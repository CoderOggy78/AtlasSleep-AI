import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Brain, Upload, Activity, TrendingUp, Moon, FileSpreadsheet, ArrowLeft, Loader2, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const fileInputRef = useRef(null);
  
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [records, setRecords] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [stats, setStats] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await axios.get(`${API}/datasets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDatasets(response.data.datasets || []);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API}/upload`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });
      
      toast.success(`Dataset "${response.data.name}" uploaded successfully! ${response.data.record_count} records processed.`);
      await fetchDatasets();
      
      // Auto-select the uploaded dataset
      setSelectedDataset(response.data.dataset_id);
      await loadDatasetData(response.data.dataset_id);
    } catch (error) {
      toast.error("Upload failed: " + (error.response?.data?.detail || error.message));
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const loadDatasetData = async (datasetId) => {
    setLoading(true);
    try {
      // Fetch records
      const recordsRes = await axios.get(`${API}/datasets/${datasetId}/records?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(recordsRes.data.records || []);

      // Fetch stats
      const statsRes = await axios.get(`${API}/stats/${datasetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // Try to fetch existing analysis
      try {
        const analysisRes = await axios.get(`${API}/analyses/${datasetId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalysis(analysisRes.data);
      } catch {
        setAnalysis(null);
      }
    } catch (error) {
      toast.error("Failed to load dataset data");
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedDataset) return;
    
    setAnalyzing(true);
    try {
      const response = await axios.post(`${API}/analyze`, {
        dataset_id: selectedDataset,
        analysis_type: "comprehensive"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalysis(response.data);
      toast.success("AI analysis complete!");
    } catch (error) {
      toast.error("Analysis failed: " + (error.response?.data?.detail || error.message));
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDatasetSelect = async (datasetId) => {
    setSelectedDataset(datasetId);
    await loadDatasetData(datasetId);
  };

  // Prepare chart data
  const getChartData = () => {
    if (!records.length) return [];
    
    return records.slice(0, 30).map((record, idx) => {
      const quality = record.sleep_quality ? parseFloat(record.sleep_quality.replace('%', '')) : 0;
      const hr = record.heart_rate ? parseFloat(record.heart_rate) : 0;
      
      return {
        date: record.start ? record.start.split(' ')[0] : `Day ${idx + 1}`,
        quality: quality,
        heart_rate: hr,
        movements: record.movements_per_hour || 0
      };
    });
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-card/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                data-testid="back-to-home-btn"
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-heading font-bold">AtlasSleep Dashboard</h1>
                  <p className="text-xs text-muted-foreground">AI-Powered Sleep Analysis</p>
                </div>
              </div>
            </div>
            
            <Button
              data-testid="upload-dataset-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 font-semibold rounded-lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Dataset
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Datasets List */}
        {datasets.length > 0 && (
          <div className="mb-8" data-testid="datasets-section">
            <h2 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              Your Datasets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {datasets.map((dataset) => (
                <Card
                  key={dataset.id}
                  data-testid={`dataset-card-${dataset.id}`}
                  className={`cursor-pointer bg-card border hover:border-primary/50 transition-all group ${
                    selectedDataset === dataset.id ? 'border-primary ring-2 ring-primary/20' : 'border-border/40'
                  }`}
                  onClick={() => handleDatasetSelect(dataset.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Moon className="w-4 h-4 text-secondary" />
                      {dataset.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {dataset.record_count} records
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No datasets state */}
        {datasets.length === 0 && (
          <div className="text-center py-20" data-testid="empty-state">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-3">No Datasets Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload your sleep tracking CSV files to get started with AI-powered analysis
            </p>
            <Button
              data-testid="empty-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 font-semibold rounded-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Dataset
            </Button>
          </div>
        )}

        {/* Analysis Section */}
        {selectedDataset && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" data-testid="stats-overview">
                <Card className="bg-card border border-border/40">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Total Nights</CardDescription>
                    <CardTitle className="text-3xl font-heading">{stats.total_nights}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-card border border-border/40">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Avg Sleep Quality</CardDescription>
                    <CardTitle className="text-3xl font-heading text-primary">
                      {stats.averages?.sleep_quality ? `${stats.averages.sleep_quality.toFixed(0)}%` : 'N/A'}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-card border border-border/40">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Avg Heart Rate</CardDescription>
                    <CardTitle className="text-3xl font-heading text-secondary">
                      {stats.averages?.heart_rate ? `${stats.averages.heart_rate.toFixed(0)}` : 'N/A'}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-card border border-border/40">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Movements/Hr</CardDescription>
                    <CardTitle className="text-3xl font-heading text-accent">
                      {stats.averages?.movements_per_hour ? stats.averages.movements_per_hour.toFixed(1) : 'N/A'}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            )}

            {/* AI Analysis Button */}
            {!analysis && (
              <div className="mb-8 text-center" data-testid="analysis-cta">
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Ready for AI Analysis
                    </CardTitle>
                    <CardDescription>
                      Generate comprehensive insights using Gemini 3 Pro
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      data-testid="run-analysis-btn"
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 font-semibold rounded-lg"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 mr-2" />
                          Run AI Analysis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Analysis Results */}
            {analysis && (
              <div className="mb-8" data-testid="analysis-results">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Sleep Score */}
                  <Card className="bg-card border border-border/40 col-span-1">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Sleep Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-heading font-bold text-primary mb-2">
                        {analysis.sleep_score?.toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {analysis.quality_trend?.replace('_', ' ')}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phenotype */}
                  <Card className="bg-card border border-border/40 col-span-2">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Sleep Phenotype</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-heading font-bold text-secondary mb-2">
                        {analysis.phenotype}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {analysis.insights}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="bg-card border border-border/40 mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Personalized Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.recommendations?.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">{idx + 1}</span>
                          </div>
                          <span className="text-sm text-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Explainability */}
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-secondary" />
                      Clinical Explainability
                    </CardTitle>
                    <CardDescription>
                      Understanding the reasoning behind predictions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground mb-2">Key Factors</div>
                        <ul className="space-y-2">
                          {analysis.explainability?.key_factors?.map((factor, idx) => (
                            <li key={idx} className="text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground mb-2">Physiological Basis</div>
                        <p className="text-sm text-foreground">
                          {analysis.explainability?.physiological_basis}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-sm text-muted-foreground">Confidence Score</span>
                        <span className="text-lg font-heading font-bold text-primary">
                          {(analysis.explainability?.confidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Visualizations */}
            {chartData.length > 0 && (
              <div className="grid grid-cols-1 gap-6" data-testid="visualizations">
                {/* Sleep Quality Trend */}
                <Card className="bg-card border border-border/40">
                  <CardHeader>
                    <CardTitle>Sleep Quality Trend</CardTitle>
                    <CardDescription>Track your sleep quality over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            color: '#f4f4f5'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="quality"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fill="url(#qualityGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Heart Rate */}
                {stats?.averages?.heart_rate && (
                  <Card className="bg-card border border-border/40">
                    <CardHeader>
                      <CardTitle>Heart Rate Patterns</CardTitle>
                      <CardDescription>Monitor cardiovascular health during sleep</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="date" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
                          <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#18181b',
                              border: '1px solid #27272a',
                              borderRadius: '8px',
                              color: '#f4f4f5'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="heart_rate"
                            stroke="#14b8a6"
                            strokeWidth={2}
                            dot={{ fill: '#14b8a6', r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Movement Patterns */}
                {stats?.averages?.movements_per_hour && (
                  <Card className="bg-card border border-border/40">
                    <CardHeader>
                      <CardTitle>Movement Patterns</CardTitle>
                      <CardDescription>Sleep fragmentation analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="date" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
                          <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#18181b',
                              border: '1px solid #27272a',
                              borderRadius: '8px',
                              color: '#f4f4f5'
                            }}
                          />
                          <Bar dataKey="movements" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;