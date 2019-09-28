import * as functions from 'firebase-functions';
import { ON_CREATE_USERS_INDEXERS, ON_CREATE_SET_USER_BALANCE } from './users/users.functions';

export const onCreateUsersIndexers: functions.CloudFunction<functions.database.DataSnapshot> = ON_CREATE_USERS_INDEXERS;
export const onCreateSetUserBalance: functions.CloudFunction<functions.database.DataSnapshot> = ON_CREATE_SET_USER_BALANCE;
