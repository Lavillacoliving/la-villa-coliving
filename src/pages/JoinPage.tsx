import { useState } from 'react';
import { Check, ArrowRight, Calendar, Users, Briefcase, Mail, Phone, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function JoinPage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-20 bg-white">
        <div className="container-custom max-w-lg text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-[#d1fae5] flex items-center justify-center mx-auto mb-6">
            <Check className="text-[#10b981]" size={40} />
          </div>
          <h1 
            className="text-4xl mb-4 text-[#0f172a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.joinPage.form.success}
          </h1>
          <p className="text-[#475569] font-medium">
            We'll review your application and get back to you within 48 hours.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-white overflow-hidden">
        {/* Pop Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10b981]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f97316]/8 rounded-full blur-[100px]" />
        
        <div className="container-custom relative text-center">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl mb-6 text-[#0f172a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.joinPage.hero.title}
          </h1>
          <p className="text-xl text-[#475569] mb-4 font-medium">
            {t.joinPage.hero.subtitle}
          </p>
          <p className="text-[#94a3b8] mb-6 font-medium">
            {t.joinPage.hero.description}
          </p>
          <p className="text-[#10b981] font-extrabold">
            {t.joinPage.hero.steps}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding relative bg-[#f8fafc]">
        <div className="container-custom max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="card-ultra p-8">
              <h3 className="text-xl font-black mb-6 text-[#0f172a]">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#475569] font-bold">
                    <User size={14} className="inline mr-2 text-[#10b981]" />
                    {t.joinPage.form.firstName}
                  </Label>
                  <Input 
                    id="firstName" 
                    required 
                    placeholder="John" 
                    className="bg-white border-2 border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#10b981] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#475569] font-bold">{t.joinPage.form.lastName}</Label>
                  <Input 
                    id="lastName" 
                    required 
                    placeholder="Doe" 
                    className="bg-white border-2 border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#10b981] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#475569] font-bold">
                    <Mail size={14} className="inline mr-2 text-[#10b981]" />
                    {t.joinPage.form.email}
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="john@example.com" 
                    className="bg-white border-2 border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#10b981] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#475569] font-bold">
                    <Phone size={14} className="inline mr-2 text-[#10b981]" />
                    {t.joinPage.form.phone}
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+33 6 12 34 56 78" 
                    className="bg-white border-2 border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#10b981] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-[#475569] font-bold">
                    <Calendar size={14} className="inline mr-2 text-[#f97316]" />
                    {t.joinPage.form.birthDate}
                  </Label>
                  <Input 
                    id="birthDate" 
                    type="date" 
                    required 
                    className="bg-white border-2 border-[#e2e8f0] text-[#0f172a] focus:border-[#10b981] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job" className="text-[#475569] font-bold">
                    <Briefcase size={14} className="inline mr-2 text-[#f97316]" />
                    {t.joinPage.form.job}
                  </Label>
                  <Input 
                    id="job" 
                    placeholder="Software Engineer" 
                    className="bg-white border-2 border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#10b981] rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="card-ultra p-8">
              <h3 className="text-xl font-black mb-6 text-[#0f172a]">Your Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="arrival" className="text-[#475569] font-bold">
                    <Calendar size={14} className="inline mr-2 text-[#10b981]" />
                    {t.joinPage.form.arrival}
                  </Label>
                  <Input 
                    id="arrival" 
                    type="date" 
                    className="bg-white border-2 border-[#e2e8f0] text-[#0f172a] focus:border-[#10b981] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-[#475569] font-bold">
                    <Users size={14} className="inline mr-2 text-[#10b981]" />
                    {t.joinPage.form.duration}
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-white border-2 border-[#e2e8f0] text-[#0f172a] focus:border-[#10b981] rounded-xl">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-[#e2e8f0]">
                      <SelectItem value="2-3">2-3 months</SelectItem>
                      <SelectItem value="3-6">3-6 months</SelectItem>
                      <SelectItem value="6-12">6-12 months</SelectItem>
                      <SelectItem value="12+">12+ months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              className="w-full btn-primary py-6 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {t.joinPage.form.submitting}
                </>
              ) : (
                <>
                  {t.joinPage.form.submit}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
