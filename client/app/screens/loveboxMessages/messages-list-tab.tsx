import React, { useEffect, useCallback, useState } from 'react';
import { I18nManager, Image, SafeAreaView, StyleSheet, TextStyle, ViewStyle, View, FlatList } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Button, Header, Text } from '../../components';
import loveboxLogo from '../../../assets/logo-color.png';
import { color, spacing, typography } from "../../theme"
import { ScrollView } from 'react-native-gesture-handler';
import { GET_MESSAGES, POST_MESSAGE } from '../../gqlQueries';
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
const BOLD: TextStyle = { fontWeight: "bold" }

const CONTAINER = {
  padding: spacing[2],
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
}

const TITLE: TextStyle = {
  ...BOLD,
  color: "#d11800",
  textAlign: 'center',
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
}

const OR_TITLE: TextStyle = {
  ...SUBTITLE,
  textAlign: 'center',
  marginTop: spacing[3],
  marginBottom: spacing[3],
}

const SECTION: TextStyle = {
  
  margin: spacing[2],
  fontSize: 20,
  fontWeight: 'bold',
  lineHeight: 22,
  marginBottom: spacing[5],
  elevation: 4,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center'
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

export const LoveboxMessagesListTab = ({
  navigation,
  route,
}): JSX.Element => {

  const { data, loading, error, refetch: getMessages } = useQuery(GET_MESSAGES);

  if (error) return <Text style={TITLE}>Error : ${error.message} ...</Text>
  return (
    <SafeAreaView style={CONTAINER}>

      <Image source={loveboxLogo} style={{ alignSelf: 'center', margin: 10 }} />
      <FlatList
        refreshing={loading}
        onRefresh={() => getMessages()}
        data={data?.messages}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.image.filename}
        renderItem={({ item, index, separators }) => {
          return (
            <View style={SECTION} >
              <Text style={{...TITLE, marginTop: 20}}>{item.message}</Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image style={{
                  resizeMode: 'cover',
                  flex: 1,
                  aspectRatio: 1,
                }}
                  source={{ uri: item.image.base64 }}
                  resizeMode={'cover'}
                />
              </View>
            </View>
          )
        }}
        ListHeaderComponent={() => (!data?.messages || !data?.messages?.length ?
          <Text style={{ ...TITLE, margin: spacing[3] }}>Aucun message a afficher pour le moment</Text>
          : null)}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});