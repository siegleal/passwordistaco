pros <- read.csv("pros.csv")
plot(1:nrow(pros), pros$Avg.Rank, ylim=c(max(pros$Avg.Rank), 0), pch=19)
lines(rbind(pros$Avg.Rank-pros$Std.Dev, pros$Avg.Rank+pros$Std.Dev, NA), rbind(pros$Avg.Rank, pros$Avg.Rank, NA))
