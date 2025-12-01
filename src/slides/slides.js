import TitleSlide from './TitleSlide';
import ProblemSlide from './ProblemSlide';
import SolutionSlide from './SolutionSlide';
import WedgeSlide from './WedgeSlide';
import EcosystemSlide from './EcosystemSlide';
import MarketSizeSlide from './MarketSizeSlide';

import TractionSlide from './TractionSlide';
import BusinessModelSlide from './BusinessModelSlide';
import GTMSlide from './GTMSlide';
import CompetitionSlide from './CompetitionSlide';
import RoadmapSlide from './RoadmapSlide';
import TeamSlide from './TeamSlide';
import AskSlide from './AskSlide';
import marketSizeDeepDiveSlides from './deepdive/marketSizeDeepDive';
import architectureDeepDiveSlides from './deepdive/architectureDeepDive';

const slides = [
  {
    id: 'title',
    component: TitleSlide,
    title: 'Title'
  },
  {
    id: 'problem',
    component: ProblemSlide,
    title: 'The Problem'
  },
  {
    id: 'solution',
    component: SolutionSlide,
    title: 'The Solution',
    hasDeepDive: true,
    deepDiveSlides: architectureDeepDiveSlides
  },
  {
    id: 'wedge',
    component: WedgeSlide,
    title: 'The Wedge'
  },
  {
    id: 'ecosystem',
    component: EcosystemSlide,
    title: 'The Ecosystem'
  },
  {
    id: 'market-size',
    component: MarketSizeSlide,
    title: 'Market Opportunity',
    hasDeepDive: true,
    deepDiveSlides: marketSizeDeepDiveSlides
  },
  {
    id: 'traction',
    component: TractionSlide,
    title: 'Traction'
  },
  {
    id: 'business-model',
    component: BusinessModelSlide,
    title: 'Business Model'
  },
  {
    id: 'gtm',
    component: GTMSlide,
    title: 'Go-To-Market'
  },
  {
    id: 'competition',
    component: CompetitionSlide,
    title: 'Competition'
  },
  {
    id: 'roadmap',
    component: RoadmapSlide,
    title: 'Roadmap'
  },
  {
    id: 'team',
    component: TeamSlide,
    title: 'Team'
  },
  {
    id: 'ask',
    component: AskSlide,
    title: 'The Ask'
  }
];

export default slides;
