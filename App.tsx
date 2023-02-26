/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import ShareMenu from 'react-native-share-menu';
import nodejs from 'nodejs-mobile-react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

type SharedItem =
  | {
      mimeType: string;
      data: string | string[];
      extraData?: any;
    }
  | undefined;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [sharedItem, setSharedItem] = useState<SharedItem>();
  const [moments, setMoments] = useState<unknown>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleShare = useCallback((item?: SharedItem) => {
    console.log('[handleShare] ===============> ', {item});
    if (!item) {
      return;
    }

    setSharedItem(item);
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    nodejs.start('main.js');
    nodejs.channel.addListener(
      'message',
      msg => {
        setMoments(msg);
      },
      // @ts-ignore
      this,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const hasSharedItem = sharedItem && sharedItem.mimeType;
  //  (typeof sharedItem === 'object' ? sharedItem.length : !!sharedItem);

  console.log('[render] ==============> ', {sharedItem});
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Welcome to <Text style={styles.highlight}>Moments</Text>
          </Section>
          <Section title="Shared items">
            <View>
              <Text>Shared item: {JSON.stringify(sharedItem)}</Text>
            </View>
          </Section>
          <Section title="Moments">
            <View>
              <Text>Shared item: {JSON.stringify(moments)}</Text>
            </View>
          </Section>
          <Section title="Share">
            <View>
              <Button
                title="Message Node"
                onPress={() => nodejs.channel.post('share', 'A message!')}
              />
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
