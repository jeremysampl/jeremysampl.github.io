import React from 'react';
import InfoCardGrid from './InfoCardGrid';

type SkillBox = {
	title: string;
	description: string;
};

export default function SkillDisplay({ boxes }: { boxes: SkillBox[] }) {
	return <InfoCardGrid items={boxes} variant="tint" />;
}
