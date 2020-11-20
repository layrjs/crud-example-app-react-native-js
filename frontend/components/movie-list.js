import {Component, attribute, consume} from '@layr/component';
import {Routable, route} from '@layr/routable';
import React from 'react';
import {View, Text} from 'react-native';
import {view, useAsyncMemo} from '@layr/react-integration';

export class MovieList extends Routable(Component) {
  @consume() static Movie;
  @consume() static Common;

  @attribute('Movie[]?') items;

  @view() static Layout({children}) {
    return (
      <View>
        <Text style={{marginTop: 10, fontSize: 24, fontWeight: 'bold'}}>Movies</Text>
        {children}
      </View>
    );
  }

  @route('/movies', {aliases: ['/']}) @view() static Main() {
    const [movieList, isLoading, loadingError, retryLoading] = useAsyncMemo(async () => {
      const movieList = new this();

      movieList.items = await this.Movie.find(
        {},
        {title: true, year: true},
        {sort: {year: 'desc', title: 'asc'}}
      );

      return movieList;
    }, []);

    if (isLoading) {
      return <this.Common.LoadingMessage />;
    }

    if (loadingError) {
      return (
        <this.Common.ErrorMessage
          message="Sorry, something went wrong while loading the movies."
          onRetry={retryLoading}
        />
      );
    }

    return (
      <this.Layout>
        <movieList.Main />
      </this.Layout>
    );
  }

  @view() Main() {
    const {Movie, Common} = this.constructor;

    return (
      <>
        <View style={{marginTop: 15, marginBottom: 10}}>
          {this.items.map((movie) => (
            <movie.ListItem key={movie.id} />
          ))}
        </View>
        <Common.Button title="New" onPress={() => Movie.Creator.navigate()} />
      </>
    );
  }
}
