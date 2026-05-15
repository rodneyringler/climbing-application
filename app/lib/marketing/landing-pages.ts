export type LandingPageSlug =
  | 'climbing-training-plan'
  | 'bouldering-training-program'
  | 'hangboard-training-for-beginners'
  | 'climbing-endurance-workouts';

export type LandingPage = {
  slug: LandingPageSlug;
  title: string;
  shortTitle: string;
  description: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroLead: string;
  audience: string;
  outcomes: string[];
  sections: {
    heading: string;
    body: string;
    bullets: string[];
  }[];
  sampleWeek: {
    day: string;
    focus: string;
    details: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const landingPages: LandingPage[] = [
  {
    slug: 'climbing-training-plan',
    title: 'Climbing Training Plan',
    shortTitle: 'Training Plans',
    description: 'Build a structured climbing training plan that balances strength, skill, endurance, recovery, and real climbing days.',
    metaDescription:
      'Learn how to build a climbing training plan for bouldering, sport climbing, and general climbing fitness with ClimbTrackr.',
    eyebrow: 'Climbing training guide',
    heroTitle: 'Build a climbing training plan you can actually follow',
    heroLead:
      'ClimbTrackr helps climbers turn vague goals into structured training blocks with workouts, exercises, programs, and progress tracking in one place.',
    audience: 'Climbers who want a repeatable weekly structure instead of random sessions.',
    outcomes: [
      'Plan strength, technique, power, endurance, and recovery days.',
      'Track what you actually completed after each session.',
      'Adjust your next block based on real progress instead of guesswork.',
    ],
    sections: [
      {
        heading: 'Start with the goal, then build the week',
        body:
          'A useful climbing training plan starts with one clear objective: stronger fingers, better redpoint endurance, more powerful bouldering, or a durable base phase. Once the goal is clear, the weekly schedule becomes easier to build.',
        bullets: [
          'Pick one primary focus for the block.',
          'Place hard climbing and strength sessions before lower-intensity volume.',
          'Protect rest days so adaptation can happen.',
        ],
      },
      {
        heading: 'Use programs to keep sessions consistent',
        body:
          'ClimbTrackr programs make it easier to repeat proven sessions, compare performance over time, and avoid rebuilding every workout from scratch.',
        bullets: [
          'Save repeatable workouts for each training focus.',
          'Group exercises into complete programs.',
          'Use your history to decide when to progress volume or intensity.',
        ],
      },
    ],
    sampleWeek: [
      { day: 'Monday', focus: 'Limit bouldering', details: 'High-quality attempts on hard moves with full rests.' },
      { day: 'Tuesday', focus: 'Mobility and antagonist work', details: 'Shoulders, wrists, hips, and light pushing strength.' },
      { day: 'Wednesday', focus: 'Finger strength', details: 'Structured hangboard or board climbing session.' },
      { day: 'Thursday', focus: 'Rest', details: 'No hard climbing; easy walk or mobility only.' },
      { day: 'Friday', focus: 'Power endurance', details: 'Intervals, linked boulders, or route laps.' },
      { day: 'Weekend', focus: 'Outdoor or gym climbing', details: 'Apply the week’s training to real climbing goals.' },
    ],
    faqs: [
      {
        question: 'How many days per week should climbers train?',
        answer:
          'Most climbers make better progress with two to four focused sessions per week than with constant low-quality fatigue. The right number depends on climbing age, recovery, and goals.',
      },
      {
        question: 'Can beginners use a climbing training plan?',
        answer:
          'Yes, but beginner plans should emphasize movement practice, gradual volume, basic strength, and recovery rather than aggressive hangboard or campus training.',
      },
    ],
  },
  {
    slug: 'bouldering-training-program',
    title: 'Bouldering Training Program',
    shortTitle: 'Bouldering Program',
    description: 'Train for stronger bouldering with focused sessions for power, tension, contact strength, movement skill, and recovery.',
    metaDescription:
      'Create a bouldering training program for power, finger strength, body tension, and movement skill with ClimbTrackr.',
    eyebrow: 'Bouldering performance',
    heroTitle: 'Create a bouldering training program for harder problems',
    heroLead:
      'A good bouldering program blends limit attempts, finger strength, body tension, movement practice, and enough recovery to actually get stronger.',
    audience: 'Boulderers who want more powerful movement and better session structure.',
    outcomes: [
      'Organize limit bouldering, volume, and strength work across the week.',
      'Track attempts, exercises, and completed workouts.',
      'Build repeatable power-focused programs inside ClimbTrackr.',
    ],
    sections: [
      {
        heading: 'Separate limit climbing from volume days',
        body:
          'Hard bouldering requires freshness. Treat limit bouldering like strength training: lower volume, longer rests, and high intent. Save volume circuits for a different day.',
        bullets: [
          'Warm up gradually before hard attempts.',
          'Rest long enough to make each try high quality.',
          'Stop before sloppy attempts become the majority of the session.',
        ],
      },
      {
        heading: 'Track strength without losing the climbing focus',
        body:
          'Supplemental exercises should support climbing, not replace it. ClimbTrackr helps you keep finger work, core, and pulling strength tied to the larger training plan.',
        bullets: [
          'Use short strength blocks after climbing or on separate days.',
          'Keep records of loads, holds, sets, and perceived effort.',
          'Progress slowly enough to avoid finger and elbow flare-ups.',
        ],
      },
    ],
    sampleWeek: [
      { day: 'Monday', focus: 'Limit bouldering', details: 'Project-level problems with long rests.' },
      { day: 'Tuesday', focus: 'Core and antagonist strength', details: 'Tension drills, pushing, rotator cuff, and mobility.' },
      { day: 'Wednesday', focus: 'Volume bouldering', details: 'Moderate problems, flash practice, and movement variety.' },
      { day: 'Thursday', focus: 'Rest', details: 'Prioritize sleep, food, and easy mobility.' },
      { day: 'Friday', focus: 'Power and fingers', details: 'Board climbing, max hangs, or contact strength work.' },
      { day: 'Weekend', focus: 'Outdoor bouldering', details: 'Apply power and tactics on real rock.' },
    ],
    faqs: [
      {
        question: 'What should a bouldering training program include?',
        answer:
          'Most programs should include limit bouldering, moderate volume, finger strength, body tension, mobility, and rest. The exact mix depends on the climber’s weaknesses and goals.',
      },
      {
        question: 'How long should a bouldering block last?',
        answer:
          'Four to eight weeks is a practical length for most climbers. It is long enough to repeat sessions and measure progress without staying locked into one focus forever.',
      },
    ],
  },
  {
    slug: 'hangboard-training-for-beginners',
    title: 'Hangboard Training for Beginners',
    shortTitle: 'Hangboard Basics',
    description: 'Learn how beginner climbers can approach hangboard training safely, progressively, and without replacing actual climbing practice.',
    metaDescription:
      'Beginner-friendly hangboard training guidance for climbers, including safety, progression, frequency, and tracking with ClimbTrackr.',
    eyebrow: 'Finger strength basics',
    heroTitle: 'Approach hangboard training with patience and structure',
    heroLead:
      'Hangboarding can help finger strength, but beginners need conservative progressions, careful tracking, and plenty of real climbing movement practice.',
    audience: 'Newer climbers who want stronger fingers without rushing into risky training.',
    outcomes: [
      'Understand when hangboarding makes sense for newer climbers.',
      'Track easy repeatable sessions instead of guessing intensity.',
      'Keep finger training balanced with technique and recovery.',
    ],
    sections: [
      {
        heading: 'Earn the right to add intensity',
        body:
          'Many beginners improve quickly by climbing consistently, resting well, and practicing movement. Hangboard training should be added gradually and treated as a supplement.',
        bullets: [
          'Avoid maximal hangs if fingers or elbows are irritated.',
          'Start with comfortable edges and controlled effort.',
          'Stop sessions while form and tissue quality still feel good.',
        ],
      },
      {
        heading: 'Track small changes over time',
        body:
          'Finger training works best when progression is measured. ClimbTrackr can store the session details so you can progress edge size, assistance, load, or volume carefully.',
        bullets: [
          'Record edge size, hang time, assistance, and rest time.',
          'Repeat a simple protocol long enough to see trends.',
          'Increase only one variable at a time.',
        ],
      },
    ],
    sampleWeek: [
      { day: 'Monday', focus: 'Technique climbing', details: 'Easy to moderate problems with footwork drills.' },
      { day: 'Tuesday', focus: 'Rest or mobility', details: 'Shoulders, wrists, hips, and easy movement.' },
      { day: 'Wednesday', focus: 'Intro finger session', details: 'Low-intensity hangs after a complete warm-up.' },
      { day: 'Thursday', focus: 'Rest', details: 'Let fingers and elbows adapt.' },
      { day: 'Friday', focus: 'Climbing volume', details: 'Moderate routes or boulders with good form.' },
      { day: 'Weekend', focus: 'Optional easy climbing', details: 'Keep intensity low if fingers feel tired.' },
    ],
    faqs: [
      {
        question: 'Should beginners hangboard?',
        answer:
          'Some beginners can use very conservative hangboard sessions, but many should focus first on consistent climbing, technique, and general strength. Pain is a reason to stop, not push through.',
      },
      {
        question: 'How often should a beginner hangboard?',
        answer:
          'One carefully controlled session per week is plenty for many newer climbers. More is not automatically better, especially if climbing volume is already high.',
      },
    ],
  },
  {
    slug: 'climbing-endurance-workouts',
    title: 'Climbing Endurance Workouts',
    shortTitle: 'Endurance Workouts',
    description: 'Improve route climbing endurance with structured laps, intervals, linked problems, aerobic base work, and recovery tracking.',
    metaDescription:
      'Plan climbing endurance workouts for sport climbing, route climbing, and long sessions with ClimbTrackr.',
    eyebrow: 'Route climbing endurance',
    heroTitle: 'Plan climbing endurance workouts that transfer to the wall',
    heroLead:
      'Endurance training works best when the workout matches the goal: easier mileage, pump management, power endurance, or longer outdoor days.',
    audience: 'Route climbers, gym climbers, and outdoor climbers who pump out before the top.',
    outcomes: [
      'Choose the right endurance format for the goal.',
      'Track laps, intervals, rest times, and perceived pump.',
      'Build programs for base endurance and redpoint preparation.',
    ],
    sections: [
      {
        heading: 'Match the workout to the type of fatigue',
        body:
          'A climber falling from a short crux needs different training than a climber fading after thirty meters. ClimbTrackr helps organize both base endurance and power endurance sessions.',
        bullets: [
          'Use easy continuous mileage for aerobic base.',
          'Use route intervals for pump management.',
          'Use linked boulders or hard laps for power endurance.',
        ],
      },
      {
        heading: 'Measure rest as carefully as effort',
        body:
          'Endurance sessions are defined by work and rest. Tracking both makes it easier to repeat a workout and see whether capacity is improving.',
        bullets: [
          'Record work time, rest time, number of laps, and intensity.',
          'Keep technique smooth when fatigue rises.',
          'Progress density gradually by adding work or reducing rest.',
        ],
      },
    ],
    sampleWeek: [
      { day: 'Monday', focus: 'Easy mileage', details: 'Many moderate routes with relaxed movement.' },
      { day: 'Tuesday', focus: 'Strength maintenance', details: 'Short pulling, core, and antagonist session.' },
      { day: 'Wednesday', focus: 'Route intervals', details: 'Repeated climbs with controlled rests.' },
      { day: 'Thursday', focus: 'Rest', details: 'Recover before higher intensity work.' },
      { day: 'Friday', focus: 'Power endurance', details: 'Harder linked sections or 4x4-style intervals.' },
      { day: 'Weekend', focus: 'Outdoor routes', details: 'Practice pacing, clipping stances, and redpoint tactics.' },
    ],
    faqs: [
      {
        question: 'What is the best climbing endurance workout?',
        answer:
          'The best workout depends on the limiter. Use easy mileage for base endurance, intervals for pump management, and linked hard climbing for power endurance.',
      },
      {
        question: 'How do I know if endurance is improving?',
        answer:
          'Track the same or similar workouts over time. Improvements may show up as more laps, less pump, shorter rests, better pacing, or better performance on longer climbs.',
      },
    ],
  },
];

export const landingPageBySlug = landingPages.reduce(
  (pages, page) => ({ ...pages, [page.slug]: page }),
  {} as Record<LandingPageSlug, LandingPage>,
);
