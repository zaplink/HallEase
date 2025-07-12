// Hall type compatibility mapping for reservation types
// You can edit this file to change compatibility rules easily

export const hallTypeCompatibility: Record<string, string[]> = {
	// Event types
	conference: ['LCH'],
	seminar: ['LCH'],
	workshop: ['EW', 'ML', 'ELP', 'CMP'],
	meeting: ['LCH'],
	event: ['LCH'], // fallback for generic event

	// Extra lecture types
	quiz: ['CMP'],
	practical: ['CMP'],
	lecture: ['LCH'],
};

// Helper to check compatibility
export function isHallTypeCompatible(
	reservationType: string,
	hallType: string
): boolean {
	const compatibleTypes =
		hallTypeCompatibility[reservationType.toLowerCase()];
	if (!compatibleTypes) return false;
	return compatibleTypes.includes(hallType);
}

// In your stepper form (for event and extra_lecture), add a combobox for type selection
// Example for event form:

// Removed unused eventTypeOptions and extraLectureTypeOptions

// In your Stepper or relevant step component, use these options for the type combobox:
// <FormField
//   control={form.control}
//   name='type'
//   render={({ field }) => (
//     <ComboBox
//       options={eventTypeOptions} // or extraLectureTypeOptions
//       value={field.value}
//       onChange={field.onChange}
//       label='Type'
//     />
//   )}
// />
