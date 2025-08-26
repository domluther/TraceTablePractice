export type AddressType = "IPv4" | "IPv6" | "MAC" | "none";

export interface InvalidAddressData {
	address: string;
	invalidType: string;
	reason: string;
}

export interface AddressData {
	address: string;
	type: AddressType;
	invalidType?: string;
	invalidReason?: string;
}

export function generateIPv4(): string {
	// Create a valid IPv4 address: four numbers from 0-255 separated by dots
	// First octet is 1-255, remaining octets are 0-255
	const firstOctet = Math.floor(Math.random() * 255) + 1;
	const remainingOctets = Array.from({ length: 3 }, () =>
		Math.floor(Math.random() * 256),
	);

	return [firstOctet, ...remainingOctets].join(".");
}

export function generateIPv6(): string {
	// Standard IPv6 format without compression for simplicity
	return Array.from({ length: 8 }, () =>
		Math.floor(Math.random() * 65536)
			.toString(16)
			.padStart(4, "0"),
	).join(":");
}

export function generateMAC(): string {
	// Randomly choose between colon and dash format
	const separator = Math.random() > 0.5 ? ":" : "-";

	// Create a valid MAC address: six pairs of hex digits (0-9, A-F)
	return Array.from({ length: 6 }, () =>
		Math.floor(Math.random() * 256)
			.toString(16)
			.padStart(2, "0")
			.toUpperCase(),
	).join(separator);
}

export function generateInvalidAddress(): InvalidAddressData {
	const invalidTypes = [
		// IPv4 with 2 chunks
		{
			generator: () =>
				Array.from({ length: 2 }, () => Math.floor(Math.random() * 256)).join(
					".",
				),
			invalidType: "IPv4",
			reason: "has too few segments (2 not 4)",
		},

		// IPv4 with 3 chunks
		{
			generator: () =>
				Array.from({ length: 3 }, () => Math.floor(Math.random() * 256)).join(
					".",
				),
			invalidType: "IPv4",
			reason: "has too few segments (3 not 4)",
		},

		// IPv4 with 5 chunks
		{
			generator: () =>
				Array.from({ length: 5 }, () => Math.floor(Math.random() * 256)).join(
					".",
				),
			invalidType: "IPv4",
			reason: "has too many segments (5 not 4)",
		},

		// IPv4 with colons instead of dots
		{
			generator: () =>
				Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(
					":",
				),
			invalidType: "IPv4",
			reason: "has wrong separators (colons instead of dots)",
		},

		// IPv4 with dashes instead of dots
		{
			generator: () =>
				Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(
					"-",
				),
			invalidType: "IPv4",
			reason: "has wrong separators (dashes instead of dots)",
		},

		// IPv4 with at least one number out of range (> 255)
		{
			generator: () => {
				const segments = Array.from({ length: 4 }, () =>
					Math.floor(Math.random() * 256),
				);
				const outOfRangeIndex = Math.floor(Math.random() * 4);
				segments[outOfRangeIndex] = 256 + Math.floor(Math.random() * 744); // 256-999
				return segments.join(".");
			},
			invalidType: "IPv4",
			reason: "contains out-of-range numbers (over 255)",
		},

		// IPv4 with negative numbers
		{
			generator: () => {
				const segments = Array.from({ length: 4 }, () =>
					Math.floor(Math.random() * 256),
				);
				const negativeIndex = Math.floor(Math.random() * 4);
				segments[negativeIndex] = -Math.floor(Math.random() * 255) - 1; // -1 to -255
				return segments.join(".");
			},
			invalidType: "IPv4",
			reason: "contains a negative number",
		},

		// IPv4 with letter characters mixed in
		{
			generator: () => {
				const segments = Array.from({ length: 4 }, () =>
					Math.floor(Math.random() * 256).toString(),
				);
				const letterIndex = Math.floor(Math.random() * 4);
				const letters = "abcdefghijklmnopqrstuvwxyz";
				segments[letterIndex] =
					segments[letterIndex] +
					letters.charAt(Math.floor(Math.random() * letters.length));
				return segments.join(".");
			},
			invalidType: "IPv4",
			reason: "contains non-numeric characters",
		},

		// IPv6 with 7 groups
		{
			generator: () =>
				Array.from({ length: 7 }, () =>
					Math.floor(Math.random() * 65536)
						.toString(16)
						.padStart(4, "0"),
				).join(":"),
			invalidType: "IPv6",
			reason: "has too few segments (7 not 8)",
		},

		// IPv6 with 9 groups
		{
			generator: () =>
				Array.from({ length: 9 }, () =>
					Math.floor(Math.random() * 65536)
						.toString(16)
						.padStart(4, "0"),
				).join(":"),
			invalidType: "IPv6",
			reason: "has too many segments (9 not 8)",
		},

		// IPv6 with invalid hex characters
		{
			generator: () => {
				const segments = Array.from({ length: 8 }, () =>
					Math.floor(Math.random() * 65536)
						.toString(16)
						.padStart(4, "0"),
				);
				const invalidIndex = Math.floor(Math.random() * 8);
				const invalidChars = "ghijklmnopqrstuvwxyz";
				const position = Math.floor(Math.random() * 4);
				const chars = segments[invalidIndex].split("");
				chars[position] = invalidChars.charAt(
					Math.floor(Math.random() * invalidChars.length),
				);
				segments[invalidIndex] = chars.join("");
				return segments.join(":");
			},
			invalidType: "IPv6",
			reason: "contains non-hexadecimal characters",
		},

		// IPv6 with dots instead of colons
		{
			generator: () =>
				Array.from({ length: 8 }, () =>
					Math.floor(Math.random() * 65536)
						.toString(16)
						.padStart(4, "0"),
				).join("."),
			invalidType: "IPv6",
			reason: "has wrong separators (dots instead of colons)",
		},

		// MAC with 7 pairs
		{
			generator: () =>
				Array.from({ length: 7 }, () =>
					Math.floor(Math.random() * 256)
						.toString(16)
						.padStart(2, "0")
						.toUpperCase(),
				).join(":"),
			invalidType: "MAC",
			reason: "has too many segments (7 not 6)",
		},

		// MAC with 5 pairs
		{
			generator: () =>
				Array.from({ length: 5 }, () =>
					Math.floor(Math.random() * 256)
						.toString(16)
						.padStart(2, "0")
						.toUpperCase(),
				).join(":"),
			invalidType: "MAC",
			reason: "has too few segments (5 not 6)",
		},

		// MAC with invalid hex characters
		{
			generator: () => {
				const segments = Array.from({ length: 6 }, () =>
					Math.floor(Math.random() * 256)
						.toString(16)
						.padStart(2, "0")
						.toUpperCase(),
				);
				const invalidIndex = Math.floor(Math.random() * 6);
				const invalidChars = "GHIJKLMNOPQRSTUVWXYZ";
				const position = Math.floor(Math.random() * 2);
				const chars = segments[invalidIndex].split("");
				chars[position] = invalidChars.charAt(
					Math.floor(Math.random() * invalidChars.length),
				);
				segments[invalidIndex] = chars.join("");
				return segments.join(":");
			},
			invalidType: "MAC",
			reason: "contains non-hexadecimal characters",
		},

		// MAC with dots instead of colons
		{
			generator: () =>
				Array.from({ length: 6 }, () =>
					Math.floor(Math.random() * 256)
						.toString(16)
						.padStart(2, "0")
						.toUpperCase(),
				).join("."),
			invalidType: "MAC",
			reason: "has wrong separators (dots instead of colons or hyphens)",
		},
	];

	const selectedInvalid =
		invalidTypes[Math.floor(Math.random() * invalidTypes.length)];
	const address = selectedInvalid.generator();
	return {
		address,
		invalidType: selectedInvalid.invalidType,
		reason: selectedInvalid.reason,
	};
}

export function generateRandomAddress(): AddressData {
	// Slight more weight to invalid addresses for better learning experience
	const types: AddressType[] = [
		"IPv4",
		"IPv4",
		"IPv6",
		"IPv6",
		"MAC",
		"MAC",
		"none",
		"none",
		"none",
	];
	const randomType = types[Math.floor(Math.random() * types.length)];

	let address: string;
	let invalidType: string | undefined;
	let invalidReason: string | undefined;

	switch (randomType) {
		case "IPv4":
			address = generateIPv4();
			break;
		case "IPv6":
			address = generateIPv6();
			break;
		case "MAC":
			address = generateMAC();
			break;
		case "none": {
			const invalidData = generateInvalidAddress();
			address = invalidData.address;
			invalidType = invalidData.invalidType;
			invalidReason = invalidData.reason;
			break;
		}
		default:
			address = generateIPv4();
	}

	return {
		address,
		type: randomType,
		invalidType,
		invalidReason,
	};
}
