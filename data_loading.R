#dataloading

library(here)
library(tidyverse)
library(sf)
library(readxl)

data_folder <- file.path(here() %>% dirname(), 'data')


#stops
stops <- read.csv(paste(data_folder, "/stops.csv", sep = ''))

#totalboardings2021
jan <- read_excel(paste(data_folder, "/totalboardings2021.xlsx", sep = ""),
                                  sheet = "Jan-Aug")

sep <- read_excel(paste(data_folder, "/totalboardings2021.xlsx", sep = ""),
                                  sheet = "Sept - Dec")


