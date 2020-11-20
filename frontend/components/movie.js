import {consume} from '@layr/component';
import {Routable, route} from '@layr/routable';
import React, {useMemo} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {view, useAsyncMemo, useAsyncCallback} from '@layr/react-integration';

export function Movie(Base) {
  class Movie extends Routable(Base) {
    @consume() static MovieList;
    @consume() static Common;

    @view() static Layout({children}) {
      return (
        <View>
          <Text style={{marginTop: 10, fontSize: 24, fontWeight: 'bold'}}>Movie</Text>
          {children}
        </View>
      );
    }

    @view() static Loader({id, children}) {
      const [movie, isLoading, loadingError, retryLoading] = useAsyncMemo(async () => {
        return await this.get(id, {title: true, year: true, country: true});
      }, [id]);

      if (isLoading) {
        return <this.Common.LoadingMessage />;
      }

      if (loadingError) {
        return (
          <this.Common.ErrorMessage
            message="Sorry, something went wrong while loading the movie."
            onRetry={retryLoading}
          />
        );
      }

      return children(movie);
    }

    @route('/movies/:id') @view() static Main({id}) {
      return (
        <this.Layout>
          <this.Loader id={id}>{(movie) => <movie.Main />}</this.Loader>
        </this.Layout>
      );
    }

    @view() Main() {
      const {MovieList, Editor, Common} = this.constructor;

      const [handleDelete, isDeleting, deletingError] = useAsyncCallback(async () => {
        await this.delete();

        MovieList.Main.navigate();
      }, []);

      return (
        <View>
          {deletingError && (
            <Common.ErrorMessage message="Sorry, something went wrong while deleting the movie." />
          )}
          <View style={{marginBottom: 10}}>
            <Common.AttributeDisplay label="Title" value={this.title} />
            <Common.AttributeDisplay label="Year" value={this.year} />
            <Common.AttributeDisplay label="Country" value={this.country} />
          </View>
          <Common.Button title="Edit" onPress={() => Editor.navigate(this)} disabled={isDeleting} />
          <Common.Button title="Delete" onPress={handleDelete} disabled={isDeleting} />
          <Common.Button title="Back" onPress={() => MovieList.Main.navigate()} />
        </View>
      );
    }

    @route('/movies/-/create') @view() static Creator() {
      const movie = useMemo(() => {
        return new this();
      }, []);

      return (
        <this.Layout>
          <movie.Creator />
        </this.Layout>
      );
    }

    @view() Creator() {
      const {MovieList, Common} = this.constructor;

      const [handleSave, , savingError] = useAsyncCallback(async () => {
        await this.save();

        MovieList.Main.navigate();
      }, []);

      return (
        <View>
          {savingError && (
            <Common.ErrorMessage message="Sorry, something went wrong while saving the movie." />
          )}
          <this.Form onSubmit={handleSave} />
          <Common.Button title="Cancel" onPress={() => MovieList.Main.navigate()} />
        </View>
      );
    }

    @route('/movies/:id/edit') @view() static Editor({id}) {
      return (
        <this.Layout>
          <this.Loader id={id}>{(movie) => <movie.Editor />}</this.Loader>
        </this.Layout>
      );
    }

    @view() Editor() {
      const Movie = this.constructor;
      const {Common} = Movie;

      const forkedMovie = useMemo(() => this.fork(), []);

      const [handleSave, , savingError] = useAsyncCallback(async () => {
        await forkedMovie.save();

        this.merge(forkedMovie);

        Movie.Main.navigate(this);
      }, [forkedMovie]);

      return (
        <View>
          {savingError && (
            <Common.ErrorMessage message="Sorry, something went wrong while saving the movie." />
          )}
          <forkedMovie.Form onSubmit={handleSave} />
          <Common.Button title="Cancel" onPress={() => Movie.Main.navigate(this)} />
        </View>
      );
    }

    @view() Form({onSubmit}) {
      const {Common} = this.constructor;

      const [handleSubmit, isSubmitting] = useAsyncCallback(
        async (event) => {
          event.preventDefault();
          await onSubmit();
        },
        [onSubmit]
      );

      return (
        <>
          <View style={{marginBottom: 10}}>
            <Common.TextInput
              label="Title"
              value={this.title}
              onChangeText={(text) => {
                this.title = text;
              }}
            />
            <Common.TextInput
              label="Year"
              value={this.year !== undefined ? String(this.year) : ''}
              onChangeText={(text) => {
                this.year = Number(text) || undefined;
              }}
              keyboardType="number-pad"
            />
            <Common.TextInput
              label="Country"
              value={this.country}
              onChangeText={(text) => {
                this.country = text;
              }}
            />
          </View>
          <Common.Button title="Save" onPress={handleSubmit} disabled={isSubmitting} />
        </>
      );
    }

    @view() ListItem() {
      const {Main} = this.constructor;

      return (
        <View
          style={{
            marginTop: -1,
            paddingTop: 10,
            paddingBottom: 10,
            borderTopColor: '#ddd',
            borderTopWidth: 1,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Main.navigate(this);
            }}
          >
            <Text style={{fontSize: 20}}>
              {this.title} {this.year && <Text style={{fontSize: 14}}>({this.year})</Text>}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  return Movie;
}
