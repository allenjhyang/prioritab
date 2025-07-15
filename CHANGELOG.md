# Change Log
All notable changes to this project will be documented in this file.
This project tries to adhere to [Semantic Versioning](http://semver.org/).

## 3.0.0 - 2025-07-15
### Changed
- Updated the extension for Manifest v3 due to Chrome's deprecation of MV2 extension support.
  - Updated manifest.json to version 3
  - Removed chrome.management.uninstallSelf() API usage -- deprecated API
  - Replaced dynamic style injection with CSS custom properties
  - Added Content Security Policy to manifest

## 2.0.0 - 2017-03-26
### Changed
- Implemented flex-box on lots more elements
- Made Prioritab responsive
- Redesigned a lot of things
- Edited some of the .js files to make them smaller/more efficient
- Redesigned squaredThree to use fa-check
- Changed default colors to be the same as Currently
- Aligned everything using units relative to browser's default font size (normally 16px)
  - This caused some elements to move around a little
- Moved sortaeditalist.js to \lib

## 1.3.0 - 2017-03-25
### Added
- A few accessibility improvements

### Changed
- Colpick to [Momo Kornher's fork](https://github.com/mrgrain/colpick), which is the most patched
- Minified Colpick js and css
- Updated moment.js to version 2.18.1
- Updated jquery-ui.js to version 1.12.1
- Minified pubsub.js

## 1.2.4 - 2017-03-25
### Changed
- logo with a slightly different cleaner design
- manifest.json to reflect new logo
- credits to include Griffen Edge

## 1.2.3 - 2017-03-24
### Changed
- Fade-in animations to be even better
- Some absolute units (px) to relative units (rem)

## 1.2.2 - 2017-03-23
### Added
- Fade-in animations

## 1.2.1 - 2017-03-23
### Added
- "Open Sans" font

### Changed
- Font stack to match that of [Currently](https://chrome.google.com/webstore/detail/currently/ojhmphdkpgbibohbnpbfiefkgieacjmh?hl=en)

## 1.2.0 - 2017-03-23
### Added
- Font Awesome 4.7.0, bringing Prioritab design closer to Currently, which makes use of FA
  - Icon fonts to \fonts
  - font-awesome.min.css to \lib

### Changed
- Updated prioritab.html, prioritab.css and sortaeditlist.js to use Font Awesome

### Removed
- All old icon bitmaps
