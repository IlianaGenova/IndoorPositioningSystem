#ifndef  __HAL_H__
#define __HAL_H__

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
// #include <Arduino.h>
// #include <SPI.h>

// connection pins
#define RST_PIN 9    // reset pin
#define IRQ_PIN 8    // irq pin
#define SS_PIN  SS   // spi select pin

//DWM1000 modes 
#define IDLE 0x00
#define RX 0x01
#define TX_MODE 0x02

#define NOTHING 0x00
#define NONE 0x00


#define SPI_NO_SUB_ADDR 0x00
#define SPI_SUB_ADDR 0x40
#define SPI_EXT_ADDR 0x80
#define SPI_WRITE 0x80
#define SPI_READ 0x00


//Register addresses 
//Base addresses 
#define DEV_ID 0x00
#define DEV_ID_LEN 4 
#define EUI 0x01
#define EUI_LEN 8
#define PANADR 0x03     //0-15 short addr, 16-31P PAN ID
#define PANADR_LEN 4    //automatically set to 0xFF


//User manual, 7.2.36.3, automatic gain control tune
#define AGC_TUNE 0x23
#define AGC_TUNE1 0x04
#define AGC_TUNE1_LEN 2
#define AGC_TUNE2 0x0C
#define AGC_TUNE2_LEN 4
//values from Table 24 
#define AGC_TUNE1_16 0x8870 //set to be default
#define AGC_TUNE1_64 0x889B
//value from Table 25
#define AGC_TUNE2_VAL 0X2502A907
 
//User manual, 7.2.40.5, digital reciever tune
#define DRX_TUNE 0x27
#define DRX_TUNE1 0x08
#define DRX_TUNE1_LEN 4
//values from table 33
#define DRX_TUNE2_PAC_8_PRF_16 0x311A002D //set to be default
#define DRX_TUNE2_PAC_8_PRF_64 0x313B006B
#define DRX_TUNE2_PAC_16_PRF_16 0x331A0052
#define DRX_TUNE2_PAC_16_PRF_64 0x333B00BE
#define DRX_TUNE2_PAC_32_PRF_16 0x351A009A
#define DRX_TUNE2_PAC_32_PRF_64 0x353B015E
#define DRX_TUNE2_PAC_64_PRF_16 0x371A011D
#define DRX_TUNE2_PAC_64_PRF_64 0x373B0296


//User manual, 7.2.47, leading edge detection interface
#define LDE_IF 0x2E
//LDE treshold 7.2.47.1
#define LDE_THRESH 0x00
#define LDE_THRESH_LEN 2
//LDE config 7.2.47.2
#define LDE_CFG1 0x0806
#define LDE_CFG1_LEN 1
//LDE config sub - noise threshold multiplier and peak multiplier
#define LDE_CFG1_NTM_LOS 0xD
#define LDE_CFG1_NTM_NLOS 0xC
#define LDE_CFG1_PMULT 0x3
//LDE config 2 7.2.47.6
#define LDE_CFG2 0x1806
#define LDE_CFG2_LEN 2
//values from table 50
#define LDE_CFG1_16 0x1607 //set to be default
#define LDE_CFG1_64 0x0607


//User manual 7.2.41, Analog RF config
#define RF_CONF 0x28
//Analog transmission control register, 7.2.41.4
#define RF_TXCTRL 0x0C
#define RF_TXCTRL_LEN 3
//values from table 38
#define RF_TXCTRL_CH1 0x00005C40
#define RF_TXCTRL_CH2 0x00045CA0
#define RF_TXCTRL_CH3 0x00086CC0
#define RF_TXCTRL_CH4 0x00045C80
#define RF_TXCTRL_CH5 0x001E3FE0 //set to be default
#define RF_TXCTRL_CH7 0x001E7DE0


//User manual 7.2.43, Transmitter calibration block
#define TX_CAL 0x2A
//Pulse generator delay, 7.2.43.6
#define TC_PGDELAY 0x0B
#define TC_PGDELAY_LEN 1
//values from table 40
#define TC_PGDELAY_CH1 0xC9
#define TC_PGDELAY_CH2 0xC2
#define TC_PGDELAY_CH3 0xC5
#define TC_PGDELAY_CH4 0x95
#define TC_PGDELAY_CH5 0xC0 //set to be default
#define TC_PGDELAY_CH7 0x93


//User manual 7.2.44, frequency synthesiser control block
#define FS_CTRL 0x2B
//PLL tuning register, 7.2.44.3
#define FS_PLLTUNE 0x0B
#define FS_PLLTUNE_LEN 1
//values from table 44
#define FS_PLLTUNE_CH1 0x1E
#define FS_PLLTUNE_CH2_CH4 0x26
#define FS_PLLTUNE_CH3 0x56
#define FS_PLLTUNE_CH5_CH7 0xBE //set to be default

//
#endif /* __HAL_H__ */