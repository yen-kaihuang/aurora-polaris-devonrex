import { describe, it, expect } from 'vitest';
import { ui } from './ui';

const requiredKeys = [
  // hero / intro
  'adoption.heroTitle',
  'adoption.intro',
  // 18 field labels
  'adoption.fields.first_name',
  'adoption.fields.last_name',
  'adoption.fields.email',
  'adoption.fields.phone',
  'adoption.fields.address',
  'adoption.fields.alt_contact',
  'adoption.fields.family_members',
  'adoption.fields.other_pets',
  'adoption.fields.living_situation',
  'adoption.fields.interest_in_devon_rex',
  'adoption.fields.personality_preference',
  'adoption.fields.personality_other',
  'adoption.fields.age_preference',
  'adoption.fields.quality_level',
  'adoption.fields.coat_color',
  'adoption.fields.wait_time',
  'adoption.fields.referral_source',
  'adoption.fields.additional_info',
  // options
  'adoption.options.personality_preference.outgoing',
  'adoption.options.personality_preference.energetic',
  'adoption.options.personality_preference.vocal',
  'adoption.options.personality_preference.laid_back',
  'adoption.options.personality_preference.quiet',
  'adoption.options.personality_preference.energetic_relaxed',
  'adoption.options.personality_preference.other',
  'adoption.options.age_preference.kitten',
  'adoption.options.age_preference.adult',
  'adoption.options.quality_level.pet',
  'adoption.options.quality_level.breeding',
  'adoption.options.quality_level.show',
  'adoption.options.quality_level.retention',
  'adoption.options.coat_color.solid',
  'adoption.options.coat_color.bicolor_van',
  'adoption.options.coat_color.calico_van',
  'adoption.options.coat_color.tabby',
  'adoption.options.coat_color.pointed',
  'adoption.options.wait_time.lt_3m',
  'adoption.options.wait_time.3_6m',
  'adoption.options.wait_time.6_12m',
  'adoption.options.wait_time.gt_12m',
  // errors
  'adoption.errors.required',
  'adoption.errors.email',
  'adoption.errors.submit',
  'adoption.errors.submitWithReason',
  // buttons + thanks
  'adoption.submitButton',
  'adoption.submitButtonSending',
  'adoption.thanksTitle',
  'adoption.thanksBody',
  'adoption.backToHome',
] as const;

describe('adoption i18n keys', () => {
  for (const lang of ['en', 'zh'] as const) {
    it(`all required keys exist and are non-empty in ${lang}`, () => {
      const dict = ui[lang] as Record<string, string>;
      const missing = requiredKeys.filter((k) => !dict[k]);
      expect(missing).toEqual([]);
    });
    it(`submitWithReason in ${lang} contains {reason} placeholder`, () => {
      const dict = ui[lang] as Record<string, string>;
      expect(dict['adoption.errors.submitWithReason']).toContain('{reason}');
    });
  }
});
