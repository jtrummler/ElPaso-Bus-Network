#dataloading

library(here)
library(tidyverse)
library(sf)

data_folder <- file.path(here() %>% dirname(), 'data')


#stops
stops <- read.csv(paste(data_folder, "/stops.csv", sep = ''))


