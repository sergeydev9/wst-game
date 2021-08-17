import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import { testDecks, testQuestions } from '../util/testEntityGenerators';
import GeneratedNames from './GeneratedNames';

// describe('GeneratedNames dao', () => { })