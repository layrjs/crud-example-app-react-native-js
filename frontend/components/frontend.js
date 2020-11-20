import {Component, provide} from '@layr/component';
import {Storable} from '@layr/storable';
import {ComponentHTTPClient} from '@layr/component-http-client';
import React from 'react';
import {view, useMemoryRouter} from '@layr/react-integration';
import {SafeAreaView, ScrollView, View, Text} from 'react-native';

import {MovieList} from './movie-list';
import {Movie} from './movie';
import {Common} from './common';

export const getFrontend = async ({backendURL}) => {
  const client = new ComponentHTTPClient(backendURL, {mixins: [Storable]});

  const BackendMovie = await client.getComponent();

  class Frontend extends Component {
    @provide() static MovieList = MovieList;
    @provide() static Movie = Movie(BackendMovie);
    @provide() static Common = Common;

    @view() static Main() {
      const [router] = useMemoryRouter(this, {
        initialURLs: ['/']
      });

      const content = router.callCurrentRoute();

      return (
        <SafeAreaView>
          <View style={{padding: 10}}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <View>
                <Text style={{fontSize: 32, fontWeight: 'bold'}}>CRUD example app</Text>
                {content}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
  }

  return Frontend;
};
