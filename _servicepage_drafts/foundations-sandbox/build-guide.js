const { Document, Packer, Paragraph, TextRun, PageBreak, AlignmentType, PageOrientation,
        HeadingLevel, BorderStyle, ShadingType, TabStopType, TabStopPosition,
        Table, TableRow, TableCell, WidthType } = require('docx');
const fs = require('fs');

const FOREST = '1B3D2F';
const RUST = 'C4501C';
const GRAY = '666666';
const LIGHT_GRAY = '999999';
const BG_LIGHT = 'F7F7F5';
const WHITE = 'FFFFFF';

// Helper: simple paragraph
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 120 },
    alignment: opts.align || AlignmentType.LEFT,
    indent: opts.indent ? { left: opts.indent } : undefined,
    children: [new TextRun({
      text,
      font: opts.font || 'DM Sans',
      size: opts.size || 21,
      color: opts.color || GRAY,
      bold: opts.bold || false,
      italics: opts.italics || false,
    })],
  });
}

// Helper: section label (small caps green)
function label(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({
      text: text.toUpperCase(),
      font: 'DM Sans',
      size: 17,
      bold: true,
      color: FOREST,
      characterSpacing: 60,
    })],
  });
}

// Helper: page title
function title(text) {
  return new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({
      text,
      font: 'Georgia',
      size: 48,
      color: '1A1A1A',
    })],
  });
}

// Helper: phase card
function phaseCard(num, name, effort, desc) {
  return [
    new Paragraph({
      spacing: { before: 160, after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0', space: 4 } },
      children: [
        new TextRun({ text: `Phase ${num}  `, font: 'Georgia', size: 32, italics: true, color: FOREST }),
        new TextRun({ text: `${name} · ${effort}`, font: 'DM Sans', size: 17, bold: true, color: LIGHT_GRAY }),
      ],
    }),
    p(desc, { size: 20, after: 80 }),
  ];
}

// Helper: skill item with drills
function skillWithDrills(code, name, drills) {
  const items = [
    new Paragraph({
      spacing: { before: 80, after: 20 },
      children: [
        new TextRun({ text: code + '  ', font: 'DM Sans', size: 19, bold: true, color: '1A1A1A' }),
        new TextRun({ text: name, font: 'DM Sans', size: 19, color: GRAY }),
      ],
    }),
  ];
  if (drills) {
    items.push(new Paragraph({
      spacing: { after: 60 },
      indent: { left: 400 },
      children: [new TextRun({ text: drills, font: 'DM Sans', size: 15, color: LIGHT_GRAY })],
    }));
  }
  return items;
}

// Helper: skill item (title only)
function skill(code, name) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: code + '  ', font: 'DM Sans', size: 19, bold: true, color: '1A1A1A' }),
      new TextRun({ text: name, font: 'DM Sans', size: 19, color: GRAY }),
    ],
  });
}

// Helper: subphase header
function subphaseHeader(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E8F0EC', space: 4 } },
    children: [new TextRun({ text: text.toUpperCase(), font: 'DM Sans', size: 17, bold: true, color: FOREST, characterSpacing: 40 })],
  });
}

// Helper: class card
function classCard(tag, name, desc, items) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 40 },
      children: [new TextRun({ text: tag.toUpperCase(), font: 'DM Sans', size: 16, bold: true, color: RUST, characterSpacing: 40 })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: name, font: 'DM Sans', size: 22, bold: true, color: '1A1A1A' })],
    }),
    p(desc, { size: 19, after: 80 }),
    ...items.map(item => new Paragraph({
      spacing: { after: 40 },
      indent: { left: 280 },
      children: [new TextRun({ text: '·  ' + item, font: 'DM Sans', size: 19, color: GRAY })],
    })),
  ];
}

// Helper: process step
function step(num, heading, desc) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 40 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'F0F0F0', space: 8 } },
      children: [
        new TextRun({ text: `${num}   `, font: 'Georgia', size: 40, italics: true, color: FOREST }),
        new TextRun({ text: heading, font: 'DM Sans', size: 24, bold: true, color: '1A1A1A' }),
      ],
    }),
    p(desc, { size: 20, after: 120 }),
  ];
}

// Build document
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'DM Sans', size: 21 } },
    },
  },
  sections: [
    // PAGE 1: COVER
    {
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 2880, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      children: [
        new Paragraph({
          spacing: { after: 360 },
          children: [new TextRun({ text: 'TAP ATHLETES | PITCHING ACADEMY', font: 'DM Sans', size: 18, bold: true, color: LIGHT_GRAY, characterSpacing: 80 })],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: 'Foundations', font: 'Georgia', size: 84, color: '1A1A1A' })],
        }),
        new Paragraph({
          spacing: { after: 360 },
          children: [new TextRun({ text: 'Curriculum Guide', font: 'Georgia', size: 84, italics: true, color: GRAY })],
        }),
        p('A structured, progression-based pitching development program for ages 8+. This guide covers what the program develops, how it works, and how to enroll.', { size: 24, color: LIGHT_GRAY, after: 600 }),
        new Paragraph({
          spacing: { before: 200 },
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0', space: 8 } },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: 'Training Athletic Performance, Inc. · Rogers, Arkansas', font: 'DM Sans', size: 18, color: LIGHT_GRAY }),
            new TextRun({ text: '\ttapathletes.com/foundations', font: 'DM Sans', size: 18, color: LIGHT_GRAY }),
          ],
        }),
      ],
    },

    // PAGE 2: WHAT WE DEVELOP
    {
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      children: [
        label('What We Develop'),
        title('The complete pitcher.'),
        p('Foundations develops the whole pitcher through a structured mechanical curriculum. Our classes cover everything else the position demands — pitch design, game knowledge, and positional responsibilities.', { size: 22, after: 200 }),
        label('Mechanics — 4 Phases Governed by Effort Bands'),
        p('Each phase corresponds to an effort band — a defined range of throwing intensity expressed as a percentage of the pitcher\'s recent representative maximum. Phases describe what the pitcher is working on, not their age or experience level. All new pitchers begin in Phase 1 regardless of background.', { size: 19, after: 160 }),
        ...phaseCard('1', 'Movement & Throwing Foundations', 'Effort Band 1 (30–50%)', 'Learning what the positions feel like. Skills are introduced at low effort through movement-first drills — static holds, controlled weight shifts, and plyo ball work. The pitcher is not chasing velocity. They are building a proprioceptive map of how each movement should feel before any intensity is added.'),
        ...phaseCard('2', 'Stability & Transfer', 'Effort Band 2 (50–70%)', 'Can they hold it under load? Skills are reinforced with increased effort and rotational demand. Flat-ground and mound throwing with constraint focus. The question shifts from "can they do it?" to "can they repeat it?" Advancement requires demonstrated stability — not just attendance.'),
        ...phaseCard('3', 'Command & Intent Development', 'Effort Band 3 (70–85%)', 'Mechanics meet purpose. Full mound work with quadrant targeting, effort ladders, and pitch-to-pitch sequencing. The pitcher must maintain their trained patterns while commanding the ball to specific locations. Self-assessment and internal awareness become primary training tools.'),
        ...phaseCard('4', 'Competitive Integration', 'Effort Band 4 (85%+)', 'Everything under game conditions. Competitive bullpens, hitter scenarios, and pitch sequencing at game speed. The pitcher proves that trained patterns survive pressure, fatigue, and the cognitive load of real competition. This phase is earned, never rushed.'),
      ],
    },

    // PAGE 3: CLASSES
    {
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      children: [
        label('Included Classes'),
        title('Beyond mechanics.'),
        p('The game doesn\'t stop when the pitch crosses the plate. Classes cover the parts of pitching that don\'t show up in a velocity reading — included free for Foundations members.', { size: 22, after: 240 }),
        ...classCard('Pitch Design', 'Sequencing & Mix Creation',
          'How to build a pitch mix that works in sequence, not just individually. Pitchers learn to think like pitchers instead of just throwing harder.',
          ['Sequence pitches to create deception and tunnel effectively', 'Build a mix around your actual stuff, not a template', 'Make smarter count-based decisions', 'Read hitters and adjust mid-outing']),
        ...classCard('Complete Pitcher', 'Beyond the Pitch',
          'Everything a pitcher is responsible for that doesn\'t show up in a velocity reading.',
          ['Pickoff mechanics and holding runners', 'Backup responsibilities on throws and wild pitches', 'Fielding your position — PFPs and game situations', 'Communicating with your catcher and infield']),
      ],
    },

    // PAGE 4: CURRICULUM — Phase 1
    {
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      children: [
        label('Foundations Curriculum'),
        title('Phase 1'),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: 'Movement & Throwing Foundations · Effort Band 1 (30–50%)', font: 'DM Sans', size: 22, bold: true, color: FOREST })],
        }),
        subphaseHeader('Subphase A — Lower Body & Force Transfer'),
        ...skillWithDrills('A1', 'Front-Leg Stability', 'Front-Leg Post Hold · Walk-In Plyo Ball Throw to Freeze · Flat-Ground Controlled Throw with Freeze · Self-Assessment Rep'),
        ...skillWithDrills('A2', 'Drive Leg Extension', 'Wall Press Drive-Leg Extension · Drive-Leg Load & Hover · Flat-Ground Throw with Drive-Leg Focus · "Best Rep" Identification'),
        ...skillWithDrills('A3', 'Hip-to-Shoulder Separation', 'Seated Trunk Rotation · Standing Separation Walk-Through · Rocker PlyoCare Pivot Throw · Step-Behind PlyoCare Throw'),
        ...skillWithDrills('A4', 'Pelvic Rotation', 'Wall-Supported Stride-to-Hip-Turn · Partner Mirror Drill · Rocker Throw with Hip-Lead Focus · Pivot Pickoff with Pelvic Emphasis'),
        ...skillWithDrills('A5', 'Stride Direction & Momentum', 'Stride-Only Delivery Reps · Stride-to-Target with Guided Hip Lead · Plyo Ball Step-and-Throw to Line · Regulation Baseball Stride-and-Throw'),
        subphaseHeader('Subphase C — Sequencing & Integration'),
        ...skillWithDrills('C1', 'Hip-to-Shoulder Separation Timing', 'Medicine Ball Load-and-Hold · Standing Separation Drill · Pivot Pickoff with Separation Focus · Rocker Throw with Separation Focus'),
        ...skillWithDrills('C2', 'Arm Timing Relative to Hip Rotation', 'Wall Hip Rotation with Passive Arm · Rocker Hip Rotation · Step-Behind Throw with Pause · Hip-Tap Throw'),
        ...skillWithDrills('C3', 'Trunk Tilt & Forward Flexion', 'Wall-Guided Lateral Trunk Tilt · PVC Pipe Forward Flexion Hinge · Tall Kneeling Throws · Split-Stance Throws · Partner Freeze-Frame'),
        ...skillWithDrills('C4', 'Balance Point & Rocker Mechanics', 'Static Balance-Point Hold · Eyes-Closed Balance-Point Hold · Walk-Through Rocker to Balance · Rocker to Balance on 2x4 Board · Rocker-to-Balance-to-Toss'),
      ],
    },

    // PAGE 5: CURRICULUM — Phase 3
    {
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      children: [
        label('Foundations Curriculum'),
        title('Phase 3'),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: 'Command & Intent Development · Effort Band 3 (70–85%)', font: 'DM Sans', size: 22, bold: true, color: FOREST })],
        }),
        subphaseHeader('Subphase A — Lower Body & Force Transfer'),
        ...skillWithDrills('A1', 'Front-Leg Stability', 'Step-Behind to Brace Throw (65–70%) · Stretch Delivery to Called Quadrant (70–78%) · Three-Pitch Intent Ladders (70→78→85%)'),
        ...skillWithDrills('A2', 'Drive Leg Extension', 'Half-Kneeling PlyoCare Throws · Half-Foam Roller Drive-Leg Push-Off · PlyoCare Rocker & Step-Behind Throws · Mound Fastballs to Quadrant Targets · Mound Fastballs with Self-Called Locations'),
        ...skillWithDrills('A3', 'Hip-to-Shoulder Separation', 'Walk-In PlyoCare Pivot Pickoff · Rocker Throws with Separation Hold · Mound Delivery with "Hips First" Checkpoint · Targeted Four-Quadrant Fastballs · Three-Pitch Sequences'),
        ...skillWithDrills('A4', 'Pelvic Rotation', 'Step-and-Brace Pelvic Rotation · Crow-Hop Throws with Pelvic Timing · Mound Fastball Command Series · Three-Pitch Sequencing Challenge'),
        ...skillWithDrills('A5', 'Stride Direction & Momentum', 'Corridor Stride Throws · Mound Corridor Throws with Half-Zone Targeting · Sequenced Quadrant Command with Internalized Stride Corridor'),
        subphaseHeader('Subphase C — Sequencing & Integration'),
        ...skillWithDrills('C1', 'Hip-to-Shoulder Separation Timing', 'Step-Behind Rocker Throw · Band-Resisted Trunk Rotation · PlyoCare Step-Back with Verbal Timing Call · Tempo-Varied Delivery · Mound Separation-to-Spot · 3-and-3 Challenge'),
        ...skillWithDrills('C2', 'Arm Timing Relative to Hip Rotation', 'Seated Rotational Throw · Walking Wind-Up to Hip Stall · Full Delivery with Timing Self-Rating · Mound Throws with Quadrant Targeting · Three-Pitch Sequence with Intent Hold'),
        ...skillWithDrills('C3', 'Trunk Tilt & Forward Flexion', 'Rocker PlyoCare with Trunk Bias · Step-Behind with Forward Flexion Focus · Targeted Mound Throws — Glove Side Low / Arm Side Low · Challenge Round — 5 of 8'),
        ...skillWithDrills('C4', 'Balance Point & Rocker Mechanics', 'Slow-Motion Rocker Walk-Through with Pause · Rocker-to-Balance with Cone Touch · Mound Rocker "Rhythm Throws" · Quadrant Calling — "Pattern First, Location Second" · "3-in-a-Row" Challenge'),
      ],
    },

    // PAGE 6: HOW THE CURRICULUM WORKS
    {
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      children: [
        label('How the Curriculum Works'),
        title('18 skills. 4 categories. Every phase.'),
        subphaseHeader('A — Lower Body & Force Transfer'),
        skill('A1', 'Front-Leg Stability'), skill('A2', 'Drive Leg Extension'), skill('A3', 'Hip-to-Shoulder Separation'), skill('A4', 'Pelvic Rotation'), skill('A5', 'Stride Direction & Momentum'),
        subphaseHeader('B — Arm Action & Upper Body'),
        skill('B1', 'Arm Path & Hand Break Timing'), skill('B2', 'Scapular Loading'), skill('B3', 'External Rotation & Layback'), skill('B4', 'Arm Acceleration & Internal Rotation'), skill('B5', 'Glove-Side Control & Deceleration'),
        subphaseHeader('C — Sequencing & Timing'),
        skill('C1', 'Hip-to-Shoulder Separation Timing'), skill('C2', 'Arm Timing Relative to Hip Rotation'), skill('C3', 'Trunk Tilt & Forward Flexion'), skill('C4', 'Balance Point & Rocker Mechanics'),
        subphaseHeader('D — Command & Repeatability'),
        skill('D1', 'Repeatable Release Point'), skill('D2', 'Rhythm & Timing Consistency'), skill('D3', 'Mound Presence & Intent Management'), skill('D4', 'Stretch vs. Windup Mechanics'),
      ],
    },

    // PAGE 7: HOW IT WORKS
    {
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      children: [
        label('How It Works'),
        title('The process.'),
        p('Every pitcher follows the same structured entry point. The system evaluates where they are, places them correctly, and builds from there.', { size: 22, after: 240 }),
        ...step('1', 'Assessment', 'Every pitcher begins with a free, 90-minute in-person evaluation. The assessment covers training history, pitch repertoire, a full warm-up with movement quality grading, four athleticism benchmarks (broad jump, single-leg balance, rotational med ball throw, 10-yard acceleration), and a flat-ground throwing observation. No one skips this step — it produces the starting point for everything that follows.'),
        ...step('2', 'Placement', 'Based on the assessment, your pitcher is placed into the right phase and subphase. Effort bands are assigned using the pitcher\'s recent representative maximum throwing velocity — not age, not experience, and not what a parent reports on the phone. The coach manages placement using observable signals: movement quality at current effort, effort awareness, recent throwing exposure, and recovery feedback. A pitcher may be placed into different phases for different skills based on their individual development.'),
        ...step('3', 'Reserved Weekly Training', 'Training times are assigned in advance — no weekly booking, no scrambling for availability. Sessions can take place at our facility or, for Hybrid members, the coach comes to your pitcher\'s home, park, or field. The schedule is built around your family, not the other way around.'),
        ...step('4', 'Advance When Ready', 'No pitcher moves to the next phase just by attending. Advancement is earned by demonstrating the ability to perform and repeat what\'s being trained.'),
      ],
    },

    // PAGE 8: ENROLLMENT
    {
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      children: [
        label('Enrollment'),
        title('Two formats. Same progression.'),
        p('Both options begin with an in-person assessment and follow the same Foundations curriculum. The only difference is where training happens.', { size: 22, after: 280 }),
        new Paragraph({
          spacing: { after: 80 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0', space: 8 } },
          children: [
            new TextRun({ text: 'STANDARD', font: 'DM Sans', size: 17, bold: true, color: LIGHT_GRAY, characterSpacing: 40 }),
            new TextRun({ text: '   All-Facility', font: 'Georgia', size: 32, italics: true, color: '1A1A1A' }),
            new TextRun({ text: '   $510/month', font: 'Georgia', size: 32, italics: true, color: FOREST }),
          ],
        }),
        p('Every session at the TAP Athletes facility. Full access to equipment and a controlled training environment. 2 sessions/week recommended · Up to 8 sessions per month · Reserved weekly time slots · Classes included free', { size: 19, after: 200 }),
        new Paragraph({
          spacing: { after: 80 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0', space: 8 } },
          children: [
            new TextRun({ text: 'FLEXIBLE', font: 'DM Sans', size: 17, bold: true, color: FOREST, characterSpacing: 40 }),
            new TextRun({ text: '   Hybrid', font: 'Georgia', size: 32, italics: true, color: '1A1A1A' }),
            new TextRun({ text: '   $600/month', font: 'Georgia', size: 32, italics: true, color: FOREST }),
          ],
        }),
        p('Facility sessions plus up to 4 on-site visits per month — coach comes to your pitcher\'s home, park, or field. All facility sessions included · Up to 4 on-site sessions/month · Same progression — no gaps · Classes included free', { size: 19, after: 200 }),
        new Paragraph({
          spacing: { after: 80 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0', space: 8 } },
          children: [
            new TextRun({ text: 'INTRODUCTORY', font: 'DM Sans', size: 17, bold: true, color: FOREST, characterSpacing: 40 }),
            new TextRun({ text: '   Foundations Prep', font: 'Georgia', size: 32, italics: true, color: '1A1A1A' }),
          ],
        }),
        p('A one-month entry point for younger pitchers, beginners, or families new to structured training. Two 30-minute sessions per week. After one month, pitchers transition into the full program. 2×/week, 30 min · One-month commitment · Ideal for ages 8–12', { size: 19, after: 280 }),
        new Paragraph({
          spacing: { before: 200 },
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0', space: 8 } },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: 'TAP Athletes | Pitching Academy\nTraining Athletic Performance, Inc.\n1751 S 1st Street, Rogers, Arkansas 72758', font: 'DM Sans', size: 18, color: LIGHT_GRAY }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: '(833) 860-2711 · support@tapathletes.com · tapathletes.com/foundations', font: 'DM Sans', size: 18, color: LIGHT_GRAY }),
          ],
        }),
      ],
    },
  ],
});

const outPath = 'C:/Users/derri/OneDrive - Training Athletic Performance/TAP Athletes IP/tapathletes code/tapathletes/tapathletes.com/foundations/TAP-Athletes-Foundations-Curriculum-Guide.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Done:', outPath, '(' + buffer.length + ' bytes)');
});
