import type { ComponentType } from 'react';
import type { ProjectId } from '../../../data/projects';
import BlackjackPage from './BlackjackPage';
import GeckodePage from './GeckodePage';
import RCTankPage from './RCTankPage';
import StockAssistPage from './StockAssistPage';
import TerraExodusPage from './TerraExodusPage';
import TicTacToePage from './TicTacToePage';

/** Maps each project id to its page. Add a page here when adding a project. */
export const projectPages = {
	geckode: GeckodePage,
	'terra-exodus': TerraExodusPage,
	'stock-assist': StockAssistPage,
	'rc-tank': RCTankPage,
	blackjack: BlackjackPage,
	'tic-tac-toe': TicTacToePage,
} satisfies Record<ProjectId, ComponentType>;
