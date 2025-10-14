import WellHungLogo from '@/app/ui-components/well-hung-logo';
import { ArrowRightIcon, ChartBarIcon, CogIcon, BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui-components/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/boldering-hero-desktop.png"
            fill
            className="object-cover"
            alt="Bouldering climbers"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <WellHungLogo />
          </div>
          
          <h1 className={`${lusitana.className} text-4xl md:text-6xl font-bold mb-6`}>
            Climb Higher, Track Better
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-stone-200 max-w-2xl mx-auto">
            The ultimate climbing companion for boulderers and mountaineers. Track your progress, 
            build custom programs, and reach new heights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ui/signup"
              className="flex items-center justify-center gap-3 bg-sage-500 hover:bg-sage-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Start Climbing</span>
              <ArrowRightIcon className="w-6 h-6" />
            </Link>
            
            <Link
              href="/ui/login"
              className="flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-stone-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              <span>Log In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`${lusitana.className} text-3xl md:text-4xl font-bold text-stone-800 mb-4`}>
              Everything You Need to Climb Better
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for climbers who want to track progress and improve their skills.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-sage-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <ChartBarIcon className="w-8 h-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-4">Track Progress</h3>
              <p className="text-stone-600">
                Monitor your climbing improvements with detailed analytics and performance metrics.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-sage-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <CogIcon className="w-8 h-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-4">Custom Programs</h3>
              <p className="text-stone-600">
                Build personalized workout programs tailored to your climbing goals and skill level.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BookOpenIcon className="w-8 h-8 text-brown-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-4">Exercise Library</h3>
              <p className="text-stone-600">
                Access a comprehensive database of climbing exercises and techniques.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-sage-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <UserGroupIcon className="w-8 h-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-4">Community</h3>
              <p className="text-stone-600">
                Connect with fellow climbers and share your achievements and challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-sage-500 to-brown-500 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`${lusitana.className} text-3xl md:text-4xl font-bold mb-4`}>
              Join Thousands of Climbers
            </h2>
            <p className="text-xl text-sage-100">
              See why climbers worldwide trust our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-lg text-sage-100">Workouts Logged</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg text-sage-100">Exercises Available</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="text-4xl md:text-5xl font-bold mb-2">2,500+</div>
              <div className="text-lg text-sage-100">Active Climbers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-stone-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`${lusitana.className} text-3xl md:text-4xl font-bold text-stone-800 mb-4`}>
              What Climbers Are Saying
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-stone-600 mb-6">
                "This app completely transformed how I track my climbing progress. The analytics helped me identify my weak points and improve faster than ever."
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-sage-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sage-600 font-bold">S</span>
                </div>
                <div>
                  <div className="font-semibold text-stone-800">Sarah Chen</div>
                  <div className="text-stone-500">V5 Boulderer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-stone-600 mb-6">
                "The custom program builder is incredible. I can create workouts that perfectly match my training schedule and climbing goals."
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-sage-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sage-600 font-bold">M</span>
                </div>
                <div>
                  <div className="font-semibold text-stone-800">Mike Rodriguez</div>
                  <div className="text-stone-500">Route Climber</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sage-500 to-brown-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`${lusitana.className} text-3xl md:text-4xl font-bold mb-6`}>
            Ready to Elevate Your Climbing?
          </h2>
          
          <p className="text-xl mb-8 text-stone-100 max-w-2xl mx-auto">
            Join thousands of climbers who are already tracking their progress and reaching new heights. 
            Start your climbing journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ui/signup"
              className="flex items-center justify-center gap-3 bg-white text-sage-600 hover:bg-stone-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Get Started Free</span>
              <ArrowRightIcon className="w-6 h-6" />
            </Link>
            
            <Link
              href="/ui/login"
              className="flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-sage-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              <span>Already have an account?</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
