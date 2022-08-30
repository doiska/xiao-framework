import 'reflect-metadata';

import { logger } from 'src/utils/logger';

vi.mock('logger', () => ({
	logger: logger
}));