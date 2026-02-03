import React from 'react';
import {Sequence} from 'remotion';
import {IntroScene} from '../scenes/IntroScene';
import {TextScene} from '../scenes/TextScene';
import {QuoteScene} from '../scenes/QuoteScene';

interface SimpleExplainerProps {
  title: string;
  text: string;
  quote: string;
}

export const SimpleExplainer: React.FC<SimpleExplainerProps> = ({title, text, quote}) => {
  return (
    <>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene title={title} />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <TextScene text={text} />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <QuoteScene quote={quote} />
      </Sequence>
    </>
  );
};
