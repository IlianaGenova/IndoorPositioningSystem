#include <windows.h>
#include <stdint.h>
#include <string.h>
#include <func.h>
#include <HAL.h>
// #include <Arduino.h>

//DWM1000 active mode
static byte deviceMode;
//SPI communication constants 
const SPISettings SPI_settings = SPISettings(16000000L, MSBFIRST, SPI_MODE0);


//register values 
byte current_PANADR[PANADR_LEN/2];
byte current_EUI[EUI_LEN];
byte current_SA[PANADR_LEN/2];

void initialize() {
	pinMode(IRQ, INPUT);
	SPI.begin(); //initializes the SPI bus by setting SCK, MOSI, and SS to outputs, pulling SCK and MOSI low, and SS high
	attachInterrupt(digitalPinToInterrupt(IRQ), handleInterrupt, RISING);

}

//following instructions from 2.5.5 - modify default configuration
void additionalRequirementsForDefaultConfig () {
	//TODO hex string -> byte
	//automatic gain control tune - related to power of RX - set to 0x8870 for PFR 16Mhz, Table 24, User manual
	writeToRegister(AGC_TUNE, AGC_TUNE1, AGC_TUNE1_16, AGC_TUNE1_LEN);
	//automatic gain control tune - set to 0X2502A907, Table 25, User manual
	writeToRegister(AGC_TUNE, AGC_TUNE2, AGC_TUNE2_VAL, AGC_TUNE2_LEN);
	//digital receiver tune - set to 0x311A002D, PAC 8, PFR 16MHz, Table 26, User manual
	writeToRegister(DRX_TUNE, DRX_TUNE1, DRX_TUNE2_PAC_8_PRF_16, DRX_TUNE2_PAC_8_PRF_16);
	//noise treshold multiplier (NTM) - set to o 0xD
	// writeToRegister(); //TODO
	//leading edge detection config - set to 0x1607, Table 50, User manual
	writeToRegister(LDE_IF, LDE_CFG2, LDE_CFG1_16, LDE_CFG2_LEN);
	//transmit power - set to 0x0E082848
	//TODO
	//analog transmission - set to 0x001E3FE0 for channel 5, table 38, User manual
	writeToRegister(RF_CONF, RF_TXCTRL, RF_TXCTRL_CH5, RF_TXCTRL_LEN);
	//pulse generator delay - set to 0xC0 for channel 5, table 40, User manual
	writeToRegister(TX_CAL, TC_PGDELAY, TC_PGDELAY_CH5, TC_PGDELAY_LEN);
	//pll tuning - set to 0xBE, table 44, User manual
	//LDE
	//TODO
	//LDOTUNE4
	//TODO
}

//
void selectOperationalState(String state) {
	switch(state) {
		case "IDLE":
			
			break;
	}
}

void handleInterrupt() {
	//add interrupts
}

//base info functions

//read-only, Device Identifier – includes device type and revision info
void readDeviceIdentificator() {
	readFromRegister(DEV_ID, NONE, current_PANADR, DEV_ID_LEN);
}

//Extended Unique Identifier – the 64-bit IEEE device address
void readEUI() {
	readFromRegister(EUI, NONE, current_EUI, EUI_LEN);
}

//TODO
void setEUI(byte eui[]) {
	byte reversed[8];
	uint8_t size = 8;
	for(uint8_t i = 0; i < size; i++) {
		*(reversed+i) = *(eui+size-i-1);
	}
	writeToRegister(EUI, NONE, reversed, EUI_LEN);
}

void readDeviceMode() {
	//TODO
}

//IEEE 802.15.4PAN Identifier
void readPAN_ID() {
	byte data[16];
	readFromRegister(PANADR, NONE, data, PANADR_LEN); 
	
	*data = *data & (0xF0);
	strcpy(current_PANADR, data);
}

void writePAN_ID(byte id[]) {
	byte data[32];
	readFromRegister(PANADR, NONE, data, PANADR_LEN);
	
	*data = (byte) data & (0x0F); //stripping SA from PANADR register
	*data = (byte) data & (0xF0) & id;
	writeToRegister(PANADR, NONE, data, PANADR_LEN);
}

void readSA() {
	byte data[16];
	readFromRegister(PANADR, NONE, data, PANADR_LEN); 
	
	*data = data & (0x0F) << 8;
	strcpy(current_SA, data);
}

void writeSA(byte addr[]) {
	byte data[32];
	readFromRegister(PANADR, NONE, data, PANADR_LEN);
	
	*data = (byte) (*data & 0xF0); //stripping SA from PANADR register
	*data = (byte) (*data & 0x0F & *addr);
	writeToRegister(PANADR, NONE, data, PANADR_LEN);
}

void readSystemConfiguration() {
	//TODO
}




//SPI functions 
void writeToRegister(byte reg_addr, uint16_t sub_addr, byte data[], uint16_t data_size) {
	byte header[3];
	uint8_t  header_len = 1;
	uint16_t  i = 0;

	// SPI header
	if(sub_addr == SPI_NO_SUB_ADDR) {
		header[0] = SPI_WRITE | reg_addr;
	} else {
		header[0] = SPI_WRITE | SPI_SUB_ADDR | reg_addr;
		if(sub_addr < 128) {
			header[1] = (byte) sub_addr;
			header_len++;
		} else {
			header[1] = SPI_EXT_ADDR | (byte) sub_addr;
			header[2] = (byte) (sub_addr >> 7);
			header_len += 2;
		}
	}

	//SPI begin transaction and enable SPI (drive pin low)
	SPI.beginTransaction(SPI_settings);
	digitalWrite(SS_PIN, LOW);
	//transmit header byte by byte
	for(i = 0; i < header_len; i++) {
		SPI.transfer(header[i]); // send header
	}
	//transmit data (value to be written in register)
	for(i = 0; i < data_size; i++) {
		SPI.transfer(data[i]); // write values
	}
	//SPI end transaction and disable SPI pin (drive pin high)
	// delayMicroseconds(5);
	digitalWrite(SS_PIN, HIGH);
	SPI.endTransaction();
}


void readFromRegister(byte reg_addr, uint16_t sub_addr, byte data[], uint16_t data_size) {
	byte header[3];
	uint8_t header_len = 1;
	uint16_t i = 0;

	//SPI header
	if(sub_addr == SPI_NO_SUB_ADDR) {
		header[0] = SPI_READ | reg_addr;
	} else {
		header[0] = SPI_READ | SPI_SUB_ADDR | reg_addr;
		if(sub_addr < 128) {
			header[1] = (byte) sub_addr;
			header_len++;
		} else {
			header[1] = SPI_EXT_ADDR | (byte) sub_addr;
			header[2] = (byte)(sub_addr >> 7);
			header_len += 2;
		}
	}

	//SPI begin transaction and enable SPI (drive pin low)
	SPI.beginTransaction(SPI_settings);
	digitalWrite(SS_PIN, LOW);
	//transmit header byte by byte
	for(i = 0; i < header_len; i++) {
		SPI.transfer(header[i]); 
	}
	//read data (value to be written in data[])
	for(i = 0; i < data_size; i++) {
		data[i] = SPI.transfer(NOTHING); // read values
	}
	// delayMicroseconds(5);
	//SPI end transaction and disable SPI pin (drive pin high)
	digitalWrite(SS_PIN, HIGH);
	SPI.endTransaction();
}



bool validate_MAC(String MAC) {
		for(int i = 2; i < 23; i+=3) {
			if(MAC[i] != ':') {
				return false;
			}
		}
		for(int i = 0; i < 23; i++) {
				if((i+1)%3 != 0) {
						if(!((MAC[i] >= 'a' && MAC[i] <= 'f') ||
								 (MAC[i] >= 'A' && MAC[i] <= 'F') ||
								 (MAC[i] >= 0 && MAC[i] <= '9'))) {
										return false;
						}
				}
		}
		return true;
}