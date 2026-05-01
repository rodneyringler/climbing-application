import { ChartBarIcon, CogIcon, BookOpenIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui-components/fonts';
import { Exercise } from '@/app/lib/exercise/exercise';
import { getUserCount } from '@/app/lib/account/account-actions';
import { getWorkoutCount } from '@/app/lib/workout/workout-actions';
import HeroSection from '@/app/ui-components/home/hero-section';

export default async function Page() {
  const exerciseCount = await Exercise.countFiltered('');
  const userCount = await getUserCount();
  const workoutCount = await getWorkoutCount();
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

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
              <div className="text-4xl md:text-5xl font-bold mb-2">{workoutCount.toLocaleString()}+</div>
              <div className="text-lg text-sage-100">Workouts Logged</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            {/* <div className="text-4xl md:text-5xl font-bold mb-2">500+</div> */}
              <div className="text-4xl md:text-5xl font-bold mb-2">{exerciseCount}+</div>
              <div className="text-lg text-sage-100">Exercises Available</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            {/* <div className="text-4xl md:text-5xl font-bold mb-2">2,500+</div> */}
              <div className="text-4xl md:text-5xl font-bold mb-2">{userCount}+</div>
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
