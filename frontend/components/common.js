import {Component} from '@layr/component';
import React from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import {view, useDelay} from '@layr/react-integration';

export class Common extends Component {
  @view() static Button({title, onPress, disabled}) {
    return (
      <View style={{marginTop: 10, borderWidth: 1, borderRadius: 3, borderColor: '#007aff'}}>
        <Button title={title} onPress={onPress} disabled={disabled} color="#007aff" />
      </View>
    );
  }

  @view() static AttributeDisplay({label, value}) {
    return (
      <>
        <View style={{marginTop: 10}}>
          <Text style={{color: '#666'}}>{label}</Text>
        </View>
        <View>
          <Text style={{fontSize: 20}}>{value || '-'}</Text>
        </View>
      </>
    );
  }

  @view() static TextInput({label, value, onChangeText, keyboardType}) {
    return (
      <>
        <View style={{marginTop: 10}}>
          <Text style={{color: '#666'}}>{label}</Text>
        </View>
        <View
          style={{marginTop: 5, padding: 10, borderWidth: 1, borderRadius: 3, borderColor: '#ddd'}}
        >
          <TextInput
            style={{fontSize: 20}}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
          />
        </View>
      </>
    );
  }

  @view() static LoadingMessage() {
    return (
      <this.Delayed>
        <View style={{marginTop: 10}}>
          <Text>Loading...</Text>
        </View>
      </this.Delayed>
    );
  }

  @view() static ErrorMessage({message = 'Sorry, something went wrong.', onRetry}) {
    return (
      <View style={{marginTop: 10, marginBottom: 5}}>
        <Text style={{color: 'red'}}>{message}</Text>
        {onRetry && <this.Button title="Retry" onPress={onRetry} />}
      </View>
    );
  }

  @view() static Delayed({duration = 200, children}) {
    const [isElapsed] = useDelay(duration);

    if (isElapsed) {
      return children;
    }

    return null;
  }
}
