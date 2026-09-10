/**
 * Seeded into the `posts` collection.
 *
 * Article bodies are stored as typed blocks (lead / p / h2 / quote / list)
 * rather than HTML strings, so the renderer stays in control of typography and
 * nothing an editor types in the admin panel can inject markup.
 */
export const posts = [
  {
    slug: 'the-clarity-you-are-avoiding',
    order: 1,
    published: true,
    title: 'The clarity you are avoiding is usually the cheapest thing to get',
    category: 'Clarity',
    date: '2026-07-28',
    dateLabel: '28 July 2026',
    readingTime: '6 min read',
    featured: true,
    image: 'blogClarity',
    excerpt:
      'We spend months managing a problem we could name in an afternoon. Here is why naming it feels so expensive — and what changes the moment you do.',
    body: [
      {
        type: 'lead',
        text: 'Almost every client arrives with a version of the same sentence: I know something needs to change, I just cannot work out what. It is rarely true. Usually they know exactly what. They have simply not said it in a room where saying it counts.',
      },
      {
        type: 'p',
        text: 'Clarity has a reputation for being hard to find. In practice it is not hard to find at all — it is hard to hold. The moment you say the accurate sentence out loud, you become responsible for it. That is the actual cost, and it is why so much energy goes into staying slightly vague.',
      },
      { type: 'h2', text: 'Vagueness is a strategy, not a failure' },
      {
        type: 'p',
        text: 'If you never define the problem precisely, you never have to decide anything. You get to keep working hard on the general shape of it, which feels like effort and produces almost nothing. I have watched people spend two years being busy about a decision that takes twenty minutes to make.',
      },
      {
        type: 'quote',
        text: 'You are not confused. You are protecting yourself from a decision you already know the answer to.',
      },
      { type: 'h2', text: 'How to make the sentence' },
      {
        type: 'p',
        text: 'The test for an accurate sentence is simple: it should be slightly unpleasant to say, and it should be specific enough that someone could disagree with it. Try these.',
      },
      {
        type: 'list',
        items: [
          'Not "work is stressful" but "I have not turned down a request in fourteen months".',
          'Not "we have grown apart" but "I stopped telling him things in March".',
          'Not "I need better balance" but "I have three good hours a day and I give all of them away".',
        ],
      },
      {
        type: 'p',
        text: 'Notice what happens in your body when you read one that lands. That flinch is the signal. Follow it.',
      },
      { type: 'h2', text: 'What clarity does not do' },
      {
        type: 'p',
        text: 'It does not make the next step easy. It makes it obvious, which is different and sometimes worse. But obvious is workable. Vague is not. And nearly everyone I have coached would rather have a hard clear problem than a soft foggy one, once they have felt the difference.',
      },
      {
        type: 'p',
        text: 'So: what is the sentence you have been circling? Write it down badly. Then write it again, more honestly. The second one is usually the one.',
      },
    ],
  },
  {
    slug: 'boundaries-are-not-walls',
    order: 2,
    published: true,
    title: 'Boundaries are not walls — they are instructions',
    category: 'Relationships',
    date: '2026-07-11',
    dateLabel: '11 July 2026',
    readingTime: '5 min read',
    featured: true,
    image: 'blogBoundaries',
    excerpt:
      'Most people think a boundary is something you enforce on someone else. It is not. It is a decision about your own behaviour that you happen to say out loud.',
    body: [
      {
        type: 'lead',
        text: 'A boundary is not a rule you impose on another person. It is a description of what you will do. That distinction sounds pedantic until you notice how much easier it makes everything.',
      },
      {
        type: 'p',
        text: 'When you say "please stop messaging me after ten", you have handed someone else the job of maintaining your evening. When you say "I turn my phone off at ten, so I will reply in the morning", the job stays with you. One of those is enforceable by you alone. The other requires cooperation you may not get.',
      },
      { type: 'h2', text: 'Why the softer version fails' },
      {
        type: 'p',
        text: 'People soften boundaries because they are afraid of the reaction. Understandable — and it backfires precisely. A vague boundary invites negotiation. A clear one, delivered without hostility, usually ends the conversation faster than the apologetic version ever does.',
      },
      {
        type: 'quote',
        text: 'The apology in front of your boundary is an invitation to argue with it.',
      },
      { type: 'h2', text: 'A structure that works' },
      {
        type: 'list',
        items: [
          'State what you will do, in the present tense.',
          'Give one sentence of context, not three.',
          'Say what happens next, so nothing is left hanging.',
          'Stop talking.',
        ],
      },
      {
        type: 'p',
        text: 'That last step is the one people skip. Silence after a boundary feels like a gap you must fill, and filling it is almost always where the boundary gets bargained away.',
      },
      { type: 'h2', text: 'Expect the pushback' },
      {
        type: 'p',
        text: 'The first three times you hold a new boundary, someone will test it. Not out of malice — they are checking whether the rules genuinely changed. Plan for that moment before it arrives and you will hold. Improvise, and you will fold.',
      },
    ],
  },
  {
    slug: 'rest-is-not-a-reward',
    order: 3,
    published: true,
    title: 'Rest is not a reward for finishing',
    category: 'Balance',
    date: '2026-06-24',
    dateLabel: '24 June 2026',
    readingTime: '4 min read',
    featured: true,
    image: 'blogRest',
    excerpt:
      'If rest only happens once the list is clear, you will never rest — because the list is never clear. Here is what to build instead.',
    body: [
      {
        type: 'lead',
        text: 'Ask most people when they will rest and they describe a condition, not a time. When this launch is done. When the quarter closes. When things calm down. The condition never arrives, so neither does the rest.',
      },
      {
        type: 'p',
        text: 'The fix is unglamorous. Rest has to be scheduled before the work, not after it — structurally, like a standing meeting nobody is allowed to move. Not because you deserve it, but because the work degrades without it and you have simply stopped noticing how much.',
      },
      { type: 'h2', text: 'Three hours, protected' },
      {
        type: 'p',
        text: 'I usually start clients on three protected hours a week. Not a weekend, not a retreat — three hours, in the calendar, defended like a client meeting. It is small enough that nobody can argue with it and large enough to notice.',
      },
      {
        type: 'quote',
        text: 'Rest you have to earn is not rest. It is a bonus, and bonuses get cancelled.',
      },
      { type: 'h2', text: 'What counts' },
      {
        type: 'list',
        items: [
          'Anything with no outcome attached to it.',
          'Anything you would not report on.',
          'Anything you would still do if nobody knew.',
        ],
      },
      {
        type: 'p',
        text: 'Scrolling usually fails all three, which is why it leaves you flatter than when you started. That is not a moral failing. It is just poor equipment for the job.',
      },
    ],
  },
  {
    slug: 'when-the-career-fits-and-you-do-not',
    order: 4,
    published: true,
    title: 'When the career fits and you do not',
    category: 'Career',
    date: '2026-06-02',
    dateLabel: '2 June 2026',
    readingTime: '7 min read',
    featured: false,
    image: 'blogCareer',
    excerpt:
      'The hardest transitions are not the ones where something is wrong. They are the ones where everything is fine and you have quietly outgrown it.',
    body: [
      {
        type: 'lead',
        text: 'There is a particular kind of stuck that gets very little sympathy: the good job you no longer want. Nothing is wrong. That is the whole problem.',
      },
      {
        type: 'p',
        text: 'When something is broken, leaving is easy to justify. When it is merely finished, you have to justify it on the strength of your own preference — and most people were never given permission to treat their preference as sufficient reason.',
      },
      { type: 'h2', text: 'The identity lag' },
      {
        type: 'p',
        text: 'Careers are built for a version of you that existed when you chose them. That version was usually younger, more frightened, and optimising for something you have since achieved. The role kept performing. You changed. Nobody sent a notice.',
      },
      {
        type: 'quote',
        text: 'You are not ungrateful. You are five years past the decision that got you here.',
      },
      { type: 'h2', text: 'Before you jump' },
      {
        type: 'list',
        items: [
          'Separate the work from the conditions — often only one of them has gone stale.',
          'Name what you would miss. If the list is long, this may be a redesign rather than an exit.',
          'Test the next thing in miniature before you resign to it.',
          'Give the decision a deadline. Open-ended deliberation is just a slower way of staying.',
        ],
      },
      {
        type: 'p',
        text: 'Most people I work with do not need a dramatic change. They need one honest conversation with a person who is not on the payroll, and then about four months of unspectacular follow-through.',
      },
    ],
  },
  {
    slug: 'confidence-is-a-byproduct',
    order: 5,
    published: true,
    title: 'Confidence is a byproduct, not a project',
    category: 'Confidence',
    date: '2026-05-15',
    dateLabel: '15 May 2026',
    readingTime: '5 min read',
    featured: false,
    image: 'blogConfidence',
    excerpt:
      'You cannot think your way into self-trust. It accumulates from a very specific kind of evidence — and most people are not collecting any.',
    body: [
      {
        type: 'lead',
        text: 'Confidence is not a mood you can install. It is the residue of having kept your word to yourself often enough that you now assume you will.',
      },
      {
        type: 'p',
        text: 'Which means the fastest route to it is not affirmation. It is a smaller promise, kept. Then another. The size does not matter nearly as much as the streak, and the streak is what most people break first when things get busy.',
      },
      { type: 'h2', text: 'Why big commitments hurt confidence' },
      {
        type: 'p',
        text: 'An ambitious promise you break is not neutral — it is evidence against yourself, filed away. Three of those and the internal case is made. This is why people who set enormous goals often end up less confident than people who set boring ones.',
      },
      {
        type: 'quote',
        text: 'Every broken promise to yourself is a small deposit in the account marked "I do not follow through".',
      },
      { type: 'h2', text: 'The competence gap' },
      {
        type: 'p',
        text: 'Separately: a lot of people I coach are not short on confidence in general. They are short of it in three specific rooms. That is not a personality problem, it is a situational one, and it responds much faster than people expect once we stop treating it as identity.',
      },
    ],
  },
  {
    slug: 'the-first-hour-of-the-day',
    order: 6,
    published: true,
    title: 'What you do with the first hour, you do with the year',
    category: 'Habits',
    date: '2026-04-29',
    dateLabel: '29 April 2026',
    readingTime: '4 min read',
    featured: false,
    image: 'blogMornings',
    excerpt:
      'Not a morning routine. A much smaller question about who gets first access to your attention, and what it costs when the answer is everyone.',
    body: [
      {
        type: 'lead',
        text: 'I am not going to tell you to wake at five. I am going to ask who currently gets the first hour of your attention, and whether you chose them.',
      },
      {
        type: 'p',
        text: 'For most people the answer is a device, and through it, several hundred strangers with agendas. You then spend the rest of the day slightly reactive and assume that is your temperament.',
      },
      { type: 'h2', text: 'The only rule worth keeping' },
      {
        type: 'p',
        text: 'One hour of input you chose, before any input you did not. It can be silence, a walk, a page of writing, or nothing at all. The content matters far less than the order.',
      },
      {
        type: 'quote',
        text: 'Whoever gets your attention first sets the terms of the negotiation for the rest of the day.',
      },
      {
        type: 'p',
        text: 'Try it for two weeks. Not because it is virtuous, but because the difference is large and immediate enough that you will not need me to convince you.',
      },
    ],
  },
];
