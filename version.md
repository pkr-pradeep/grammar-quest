# Grammar Quest — Release History

This file maintains both concise release descriptions and detailed release notes for Grammar Quest.

The **short descriptions** are suitable for app-store release summaries, update listings, or compact changelog displays. The **long descriptions** explain the changes in more detail for project documentation and release records.

---

# Version 1.0.3

## Short description

Refreshed Mira and Arjun artwork, improved avatar presentation and noticeboard usability, refined mobile spacing, introduced character-specific sound cues, learning feedback sounds and optional haptics, added saved Guide-page preferences, and updated typography for a clearer, more engaging educational experience.

## Long description

Version 1.0.3 focuses on strengthening Grammar Quest’s character presentation, mobile usability, and interactive learning experience.

### Character artwork and presentation
- Refreshed the artwork for Mira and Arjun.
- Improved character and avatar cropping so the artwork is presented more consistently in the interface.
- Retained the character-led approach while improving how the characters appear across the application.

### Noticeboard usability
- Improved the noticeboard to make its content easier to read.
- Added zoom support so users can enlarge the noticeboard when they need to inspect its details.

### Mobile layout and spacing
- Refined the mobile footer positioning.
- Improved safe-area handling to better accommodate device insets.
- Adjusted header spacing to improve the use of available screen space on mobile devices.

### Sound effects and haptic feedback
- Added subtle sound effects associated with individual characters.
- Added learning feedback sounds to provide audio responses during learning interactions.
- Introduced optional haptic feedback.
- Added controls on the Guide page for sound and haptic preferences.
- Saved these preferences so the user's selections can persist between sessions.

### Event-based character sound cues
- Implemented event-based playback for character sound cues.
- A cue is associated with a specific application event.
- Whenever that tagged event is triggered, its assigned cue is played again.
- Playback is based on the event occurrence, rather than whether the same cue has played previously.
- Events without an assigned cue do not trigger a character cue.

### Typography
- Updated typography to improve readability and make the learning experience more engaging.
- The refreshed type style aims to add a playful character while keeping the application recognisably educational and easy to read.

---

# Version 1.0.2

## Short description

Improved the mobile learning experience with clearer safe-area spacing, smoother scrolling, more consistent navigation and progress indicators, activity-specific Guided Practice interactions, clearer answer feedback, and refinements across Learn, Independent Practice, Test, and completion screens.

## Long description

Version 1.0.2 focused on improving the clarity, consistency, and usability of the Grammar Quest learning flow, particularly on mobile devices.

### Language default
- Set the default application language to `en-US`.

### Mobile layout and navigation
- Improved mobile layout and safe-area spacing.
- Refined footer positioning.
- Smoothed scrolling behaviour.
- Clarified the up/down navigation cues to make it easier to understand when more content is available and how to move through a screen.

### Navigation and progress
- Clarified navigation across learning activities.
- Improved progress indicators so learners can better understand their position within activities.

### Guided Practice
- Enhanced Guided Practice activities A–F.
- Preserved activity-specific interactions rather than forcing every activity into the same interaction pattern.
- Improved the overall clarity of the Guided Practice experience.

### Answer interaction and learning feedback
- Improved answer selection.
- Refined hints and explanations.
- Improved correct-answer and incorrect-answer feedback to make responses clearer during practice.

### Learning and assessment screens
- Refined the Learn screens.
- Improved the Independent Practice experience.
- Refined Test screens.
- Improved completion screens so the end of a learning or assessment flow is presented more consistently.

### Readability and consistency
- Improved readability across the application.
- Refined visual consistency between screens and learning stages.

---

# Version 1.0.1

## Short description

Initial public release of Grammar Quest, introducing the core English grammar learning experience and the application's initial navigation and learning flow.

## Long description

Version 1.0.1 was the first public release of Grammar Quest.

It introduced the application's core English grammar learning experience and the initial structure through which learners could access the available learning areas and move through the application.

This release established the starting point for subsequent improvements to mobile usability, Guided Practice, learning feedback, character presentation, and interactive features.

### Android release information
- Version name: `1.0.1`
- Version code: `2` (as previously recorded for the Android release)

---

## Release documentation notes

- This file records the release information supplied for versions 1.0.1, 1.0.2, and 1.0.3.
- Android version code information is included only where it has been provided.
- No version code is stated here for versions 1.0.2 or 1.0.3 because those values have not been confirmed.
- The descriptions document the changes listed for each release; they do not claim additional features or implementation details beyond those records.
