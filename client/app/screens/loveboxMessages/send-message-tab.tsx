import React, { useCallback } from 'react';
import { I18nManager, Image, SafeAreaView, StyleSheet, TextStyle, ViewStyle, View, TextInput, Alert } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import * as ImagePicker from 'react-native-image-picker';
import { Button, Header, Text } from '../../components';
import loveboxLogo from '../../../assets/logo-color.png';
import { color, spacing, typography } from "../../theme"
import { ScrollView } from 'react-native-gesture-handler';
import { ReactNativeFile } from 'apollo-upload-client';
import { POST_MESSAGE } from '../../gqlQueries';
import { useMutation } from '@apollo/client';
const BOLD: TextStyle = { fontWeight: "bold" }

const CONTAINER = {
  padding: spacing[3],
}

const TITLE: TextStyle = {
  ...BOLD,
  color: "#d11800",
  fontSize: 20,
  lineHeight: 22,
  marginBottom: spacing[5],
}

const SUBTITLE: TextStyle = {
  ...TITLE,
  color: "#635d78",
  textAlign: 'center',
  marginTop: spacing[3],
  marginBottom: spacing[3],
  width: '100%'
}

const OR_TITLE: TextStyle = {
  ...SUBTITLE,
  textAlign: 'center',
  marginTop: spacing[3],
  marginBottom: spacing[3],
}

const SECTION: TextStyle = {
  fontSize: 20,
  fontWeight: 'bold',
  lineHeight: 22,
  marginBottom: spacing[5],
  elevation: 4,
  backgroundColor: 'white',
  padding: spacing[5],
  flexWrap: 'wrap',
  paddingTop: 0
}
const BUTTON_TEXT: TextStyle = {
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
  textAlign: 'center'
}
const BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const TEXTAREA = {
  fontFamily: 'monospace',
  borderWidth: 1,
  borderColor: "#ededed",
  padding: spacing[3],
  textAlign: 'center',
  flex: 1
}


export const LoveboxMessagesSendMessageTab = ({
  navigation,
  route,
}): JSX.Element => {

  const [postMessageToServer, { data, loading, error }] = useMutation(POST_MESSAGE, {
    onCompleted: () => {
      setMessageText('');
      setImageResponse(null);
      Alert.alert('Succès', `Le message a bien été envoyé`)
    },
    onError: (error) => {
      Alert.alert('Erreur', `Une erreur est survenue : ${error.message}`)
    }
  });

  const [imageResponse, setImageResponse] = React.useState<any>(null);
  const [messageText, setMessageText] = React.useState<any>('');

  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera({ ...options, mediaType: 'photo' }, onImageSelected);
    } else {
      ImagePicker.launchImageLibrary(options, onImageSelected);
    }
  }, []);

  const onImageSelected = useCallback((imageSelected) => {
    ImageResizer.createResizedImage(imageSelected?.assets?.[0].uri, 500, 500, 'PNG', 100, 0)
      .then(response => {
        setImageResponse(
          new ReactNativeFile({
            name: response.name,
            type: 'image/png',
            uri: response.uri
          })
        );
      })
      .catch(err => {
        console.log(err);
      });
  }, [])

  const sendMessage = React.useCallback(() => {
    return postMessageToServer({
      variables: {
        image: imageResponse, message: messageText
      },
    });
  }, [messageText, imageResponse])

  return (
    <SafeAreaView style={CONTAINER}>
      <ScrollView>
        <Image source={loveboxLogo} style={{ alignSelf: 'center', margin: 10 }} />
        <Header
          titleStyle={TITLE}
          headerTx="sendMessageTab.title"
        />
        <View style={SECTION}>
          <Header
            titleStyle={SUBTITLE}
            headerTx="sendMessageTab.titleGetPicture"
          />
          {!imageResponse && (
            <>
              <Button
                style={BUTTON}
                textStyle={BUTTON_TEXT}
                tx="imagepicker.capture"
                onPress={onButtonPress.bind(this, 'capture', {})}
              />
              <Text style={OR_TITLE} tx="sendMessageTab.Or" />
              <Button
                style={BUTTON}
                textStyle={BUTTON_TEXT}
                tx="imagepicker.library"
                onPress={onButtonPress.bind(this, 'library', {})}
              />
            </>
          )}
          {imageResponse && (
            <>
              <View style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
                <Image style={{
                  resizeMode: 'contain',
                  flex: 1,
                  aspectRatio: 1
                }}
                  source={imageResponse}
                  resizeMode={'contain'}
                />
              </View>
              <Button
                style={BUTTON}
                textStyle={BUTTON_TEXT}
                tx="imagepicker.changeImage"
                onPress={() => setImageResponse(null)}
              />
            </>
          )}
        </View>
        <View style={SECTION}>
          <Header
            titleStyle={SUBTITLE}
            headerTx="sendMessageTab.titleAddMessage"
          />
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              multiline={true}
              numberOfLines={2}
              placeholder="Votre message ici"
              style={TEXTAREA}
              onChangeText={(text) => setMessageText(text)}
              value={messageText} />
          </View>
        </View>

        <Button
          style={{ ...BUTTON, opacity: loading ? 0.5 : 1 }}
        textStyle={BUTTON_TEXT}
          tx={loading ? "sendMessageTab.loading" : "sendMessageTab.sendMessage"}
          onPress={sendMessage}
        />
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});