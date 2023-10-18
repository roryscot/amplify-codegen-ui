/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import {
  PersistentModel,
  PersistentModelConstructor,
  PersistentModelMetaData,
  IdentifierFieldOrIdentifierObject,
} from '@aws-amplify/datastore';
import { DataStore, Hub } from 'aws-amplify';

import {
  ACTION_DATASTORE_DELETE_FINISHED,
  ACTION_DATASTORE_DELETE_STARTED,
  EVENT_ACTION_DATASTORE_DELETE,
  UI_CHANNEL,
} from './constants';
import { AMPLIFY_SYMBOL } from '../amplify-symbol';
import { getErrorMessage } from '../get-error-message';

export interface UseDataStoreDeleteActionOptions<Model extends PersistentModel> {
  model: PersistentModelConstructor<Model>;
  id: IdentifierFieldOrIdentifierObject<Model, PersistentModelMetaData<Model>>;
}

/**
 * Action to Delete DataStore item
 * @internal
 */
export const useDataStoreDeleteAction =
  <Model extends PersistentModel>({ model, id }: UseDataStoreDeleteActionOptions<Model>): (() => Promise<void>) =>
  async () => {
    try {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_DELETE_STARTED,
          data: { id },
        },
        EVENT_ACTION_DATASTORE_DELETE,
        AMPLIFY_SYMBOL,
      );

      await DataStore.delete(model, id);

      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_DELETE_FINISHED,
          data: { id },
        },
        EVENT_ACTION_DATASTORE_DELETE,
        AMPLIFY_SYMBOL,
      );
    } catch (error) {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_DELETE_FINISHED,
          data: { id, errorMessage: getErrorMessage(error) },
        },
        EVENT_ACTION_DATASTORE_DELETE,
        AMPLIFY_SYMBOL,
      );
    }
  };

export const useDataStoreDeleteActionString = `export const useDataStoreDeleteAction =
<Model extends PersistentModel>({
  model,
  id,
}: UseDataStoreDeleteActionOptions<Model>): (() => Promise<void>) =>
async () => {
  try {
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_DATASTORE_DELETE_STARTED,
        data: { id },
      },
      EVENT_ACTION_DATASTORE_DELETE,
      AMPLIFY_SYMBOL
    );

    await DataStore.delete(model, id);

    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_DATASTORE_DELETE_FINISHED,
        data: { id },
      },
      EVENT_ACTION_DATASTORE_DELETE,
      AMPLIFY_SYMBOL
    );
  } catch (error) {
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_DATASTORE_DELETE_FINISHED,
        data: { id, errorMessage: getErrorMessage(error) },
      },
      EVENT_ACTION_DATASTORE_DELETE,
      AMPLIFY_SYMBOL
    );
  }
};`;
