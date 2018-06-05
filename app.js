
var app = angular.module('Solar Panel Calculation App',['ngMaterial']);
app.controller('calculationController', function($scope, $mdDialog){
	$scope.currentTab = true;
	$scope.customer = {
						name: null,
						zip: null,
						monthlyElectricBill: null,
						totalkWhPerMonth: null
					};
						
	$scope.data = {
					Percentage: 80, 
					SunHours: 5.2, 
					TotalkWhPerMonth: 0, 
					kWhPerYearWaterHeater: 0, 
					waterHeaterPrice: 0,
					YearTermSelection: 18
				};

	$scope.data.Percentage = 80;
	$scope.data.SunHours = 5.2;
	$scope.SystemRaw = 0;
	$scope.System = 0;
	$scope.WattHoursDay = 0;
	$scope.Recommended = 0;
	$scope.RecommendedSystem = 0;
	$scope.AverageSize = null;
	$scope.LowAPR = 1.0599;
	$scope.HighAPR = 1.0999;
	$scope.data.YearTermSelection = 18;
	$scope.TermSelectionList = [12, 15, 18, 20, 25];
	$scope.data.TotalkWhPerMonth = null;
	$scope.data.kWhPerYearWaterHeater = null;
	$scope.data.waterHeaterPrice = null;
	
	/*
	$scope.TotalPrice1 = 0;
	$scope.TotalPrice2 = 0;
	$scope.TotalPrice3 = 0;
	*/
	$scope.changeView = function(navOption){
		if ($scope.currentTab == false && navOption == "calculator")
		{
			$scope.currentTab = true;
		}
		else if ($scope.currentTab == true && navOption == "customer_info")
		{
			$scope.currentTab = false;
		}		
	};

	$scope.calculate = function() {
		$scope.Energy = $scope.data.TotalkWhPerMonth - ($scope.data.kWhPerYearWaterHeater /12); //kWh per month - water heater kWh per month
		$scope.WattHoursDay=(($scope.Energy*1e3)*($scope.data.Percentage/100))/30; 
		$scope.SystemRaw = ($scope.WattHoursDay/$scope.data.SunHours);
		$scope.System=parseInt($scope.SystemRaw);
		$scope.Recommended = $scope.SystemRaw+($scope.SystemRaw*0.15);
		$scope.Recommended = Math.round($scope.Recommended / 10)*10; 
		$scope.RecommendedSystem = parseInt($scope.Recommended);
		$scope.SystemSize = $scope.System;
		$scope.SystemRecSize= $scope.RecommendedSystem;
		
		
		//this value is to calculate the total price of the system
		$scope.AverageCalculation = ($scope.SystemSize + $scope.SystemRecSize)/2.00;
		
		//this is for the average size of the system
		$scope.AverageSizeNum = Math.round(((($scope.SystemSize + $scope.SystemRecSize)/2)/1000.0) * 10)/10;
		$scope.AverageSize = $scope.AverageSizeNum.toString() + "K";
		$scope.showTable = true;
	};
	
	
	$scope.calculatePricing = function() {
		//This is the total pricing
		$scope.TotalPrice1 = ($scope.AverageCalculation * 5.00) + parseInt($scope.data.waterHeaterPrice);
		$scope.MainPrice1 = "$" + $scope.TotalPrice1.toString();
		$scope.TotalPrice2 = ($scope.AverageCalculation * 4.00) + parseInt($scope.data.waterHeaterPrice);
		$scope.MainPrice2 = "$" + $scope.TotalPrice2.toString();
		$scope.TotalPrice3 = ($scope.AverageCalculation * 3.50) + parseInt($scope.data.waterHeaterPrice);
		$scope.MainPrice3 = "$" + $scope.TotalPrice3.toString();
		
		
		//These are the monthly payments
		
		//First payment amount presented to customer $5.00/Watt
		$scope.MonthlyLowerPayment1 = Math.round((($scope.TotalPrice1 * $scope.LowAPR)/($scope.data.YearTermSelection * 12)) * 100)/100;
		$scope.MonthlyLowerPayment1 = "$" + $scope.MonthlyLowerPayment1.toString();
		$scope.MonthlyUpperPayment1 = Math.round((($scope.TotalPrice1 * $scope.HighAPR)/($scope.data.YearTermSelection*12)) * 100)/100;
		$scope.MonthlyUpperPayment1 = "$" + $scope.MonthlyUpperPayment1.toString();	

		//Second payment amount presented to customer $4.00/Watt
		$scope.MonthlyLowerPayment2 = Math.round((($scope.TotalPrice2 * $scope.LowAPR)/($scope.data.YearTermSelection *12)) * 100)/100;
		$scope.MonthlyLowerPayment2 = "$" + $scope.MonthlyLowerPayment2.toString();
		$scope.MonthlyUpperPayment2 = Math.round((($scope.TotalPrice2 * $scope.HighAPR)/($scope.data.YearTermSelection *12)) * 100)/100;
		$scope.MonthlyUpperPayment2 = "$" + $scope.MonthlyUpperPayment2.toString();

		//Third payment amount presented to customer $3.50/Watt
		$scope.MonthlyLowerPayment3 = Math.round((($scope.TotalPrice3 * $scope.LowAPR)/($scope.data.YearTermSelection *12)) * 100)/100;
		$scope.MonthlyLowerPayment3 = "$" + $scope.MonthlyLowerPayment3.toString();
		$scope.MonthlyUpperPayment3 = Math.round((($scope.TotalPrice3 * $scope.HighAPR)/($scope.data.YearTermSelection *12)) * 100)/100;
		$scope.MonthlyUpperPayment3 = "$" + $scope.MonthlyUpperPayment3.toString();

		$scope.AverageMonthlySavings = Math.round((($scope.data.SunHours * $scope.AverageSizeNum) * .135 * 30) *100)/100;
		$scope.AverageMonthlySavings = "$" + $scope.AverageMonthlySavings.toString();
	};
	
	$scope.generatePDF = function(){
	 html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download( $scope.customer.name + "_Info.pdf");
            }
        });
	};
	
});
