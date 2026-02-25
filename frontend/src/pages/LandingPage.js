import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Brain, Upload, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]" />

      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-6 py-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AtlasSleep AI
            </span>
          </div>
          <Button
            data-testid="nav-dashboard-btn"
            onClick={() => navigate('/dashboard')}
            className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 font-semibold tracking-wide rounded-lg"
          >
            Open Dashboard
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Physics-Informed Foundation Model</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
              Equitable Sleep Phenotyping
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              AtlasSleep AI uses selective state-space architecture to analyze sleep patterns from wearable devices,
              providing clinically interpretable insights with real-time compatibility.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                data-testid="hero-get-started-btn"
                onClick={() => navigate('/dashboard')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 font-semibold tracking-wide text-lg px-8 py-6 rounded-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Sleep Data
              </Button>
              <Button
                data-testid="hero-learn-more-btn"
                size="lg"
                variant="outline"
                className="bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20 transition-all text-lg px-8 py-6 rounded-lg"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-card/40 backdrop-blur-sm shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJyYWluJTIwd2F2ZXMlMjBkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGRhcmt8ZW58MHx8fHwxNzcyMDE1OTg4fDA&ixlib=rb-4.1.0&q=85"
                alt="AI Brain Waves"
                className="w-full h-[400px] object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Advanced Sleep Analysis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining physiological realism, computational efficiency, and clinical transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description: "Gemini 3 Pro analyzes your sleep patterns to provide personalized recommendations"
              },
              {
                icon: Activity,
                title: "Real-time Analysis",
                description: "Process wearable device data with linear-time efficiency using Mamba architecture"
              },
              {
                icon: Sparkles,
                title: "Clinical Explainability",
                description: "Understand the reasoning behind each prediction with transparent attribution"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border/40 rounded-xl p-6 hover:border-primary/50 transition-colors duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-heading font-bold text-primary mb-2">0.93</div>
                <div className="text-muted-foreground">AUROC Score</div>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold text-secondary mb-2">65%</div>
                <div className="text-muted-foreground">Latency Reduction</div>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold text-accent mb-2">Real-time</div>
                <div className="text-muted-foreground">Wearable Compatible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">
            Ready to Analyze Your Sleep Data?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your sleep tracking data and get AI-powered insights in seconds
          </p>
          <Button
            data-testid="cta-start-btn"
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 font-semibold tracking-wide text-lg px-8 py-6 rounded-lg"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2026 AtlasSleep AI. Built with Emergent AI Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;