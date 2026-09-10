/**
 * Every photograph resolves through this map, so the whole art direction can
 * be re-shot by editing one document (`settings/media`) in the admin panel.
 *
 * `logo` and `heroPortrait` point at the files in /public. Everything else
 * ships with a neutral stock placeholder that the admin panel can replace
 * with a Firebase Storage upload.
 */
const px = (id, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export const media = {
  logo: {
    src: '/logo.png',
    alt: 'Truesaarthi',
  },
  heroPortrait: {
    src: '/hero.png',
    alt: 'Truesaarthi coaching — a calm, focused conversation in natural light',
  },
  coachPortrait: {
    src: px(7588570, 1000),
    alt: 'The coach seated in warm natural light during a coaching conversation',
  },
  coachSecondary: {
    src: px(35555305, 800),
    alt: 'The coach mid-conversation, relaxed, against a warm stone wall',
  },
  aboutJourney: {
    src: px(8070398, 900),
    alt: 'The coach sitting quietly with notes against a warm sand-coloured wall',
  },
  studio: {
    src: px(29012619, 1400),
    alt: 'The Truesaarthi studio — a bright, sparely furnished room behind sheer curtains',
  },
  studioDetail: {
    src: px(12277197, 900),
    alt: 'A pale corner of the studio with a linen chair and a cup on a side table',
  },
  group: {
    src: px(5945799, 1200),
    alt: 'A small group in discussion around a table in a bright room',
  },
  podcast: {
    src: px(31236103, 1200),
    alt: 'A studio microphone lit warmly against a dark backdrop',
  },

  // --- Transformation areas (portrait 3:4) ---------------------------------
  areaSelfDiscovery: {
    src: px(6779331, 800),
    alt: 'A hand writing in a spiral notebook beside a cup, in soft daylight',
  },
  areaConfidence: {
    src: px(7222320, 800),
    alt: 'A person standing composed on a city street',
  },
  areaCareer: {
    src: px(6209636, 800),
    alt: 'A person pausing by a window, thinking',
  },
  areaBalance: {
    src: px(7592372, 800),
    alt: 'A person sitting cross-legged on the floor of a bright, uncluttered room',
  },

  // --- Events (landscape 16:10) -------------------------------------------
  eventWorkshop: {
    src: px(8761555, 1000),
    alt: 'Workshop attendees talking in a bright room with tall windows',
  },
  eventRetreat: {
    src: px(23511043, 1000),
    alt: 'A small boat still on a mist-covered lake at first light',
  },
  eventCircle: {
    src: px(4492135, 1000),
    alt: 'A person joining a small online session from a sofa, notebook open',
  },
  eventOnline: {
    src: px(8512178, 1000),
    alt: 'A live video session in progress on a laptop in a bright room',
  },

  // --- Journal (landscape 4:3) --------------------------------------------
  blogClarity: {
    src: px(7582013, 1000),
    alt: 'A pen resting on a pale desk in a shaft of afternoon light',
  },
  blogBoundaries: {
    src: px(17110414, 1000),
    alt: 'A person looking away from the camera in soft, even daylight',
  },
  blogRest: {
    src: px(28536456, 1000),
    alt: 'Closed notebooks resting on rumpled linen in warm morning light',
  },
  blogCareer: {
    src: px(6874549, 1000),
    alt: 'A person standing at a window, mid-thought',
  },
  blogConfidence: {
    src: px(34750099, 1000),
    alt: 'A person standing outdoors, relaxed and self-possessed',
  },
  blogMornings: {
    src: px(8146207, 1000),
    alt: 'A quiet room with a bare table and light falling through sheer curtains',
  },

  // --- Programs (portrait 4:5) --------------------------------------------
  programClarity: {
    src: px(7222089, 1000),
    alt: 'A one-to-one coaching session in progress in a warm sitting room',
  },
  programGrowth: {
    src: px(5490356, 1000),
    alt: 'A sunlit room with a low sofa, plants and open doors',
  },
  programTransformation: {
    src: px(8500895, 1000),
    alt: 'A person sitting in a tall window frame, looking out across open hills',
  },
};
