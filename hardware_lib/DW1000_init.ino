#include <HAL.h>
#include <func.h>

// MAC address configuration 
String MAC_address;
volatile boolean valid_MAC = false;

void setup() {
	// DEBUG monitoring
	Serial.begin(9600);

	

	// input desired MAC address
	Serial.println("Enter desired MAC address for your device:");
	while(!(valid_MAC)) {
		while(Serial.available()) {
			//TODO: check the DB if the MAC already exists
			MAC_address = Serial.readString();

			if(func.validate_MAC(MAC_address)) {
				valid_MAC = true;
				Serial.println("Configuration successful");
			}
				
			else {
				valid_MAC = false;
				Serial.println("Configuration failed");
			}
		}
	}
}

void loop() {

}

