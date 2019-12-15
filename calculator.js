
//DATE CALCULATIONS
//function to add months
Date.prototype.addMonths = function(months) {
  var date = new Date(this.valueOf());
  date.setMonth(date.getMonth() + months);
  return date;
};

function getData(principal, interestPa, tenure, rs_revenue, annualGrowth) {
  // let principal = 100000;
  let interest = interestPa / 100 / 12;
  let payments = tenure * 12;
  // let rs_revenue = 60000;
  let rs_monthly_revenue = rs_revenue / 12;
  let rs_multiple = 3;
  let rs_rate = 5 / 100;
  let rs_current_payment = rs_monthly_revenue * rs_rate;
  let rs_annual_growth = 1 + annualGrowth/100;
  let rs_growth = Math.pow(rs_annual_growth, 1 / (12 - 1)) - 1;
  let rs_hurdle = rs_multiple * principal;
  //RS CALCULATIONS
  //compute revenue share first monthly payment
  let current_revenue = rs_monthly_revenue;
  let rs_payment_array = [];
  while (rs_payment_array.reduce((a, b) => a + b, 0) < rs_hurdle) {
    if (
        rs_payment_array.reduce((a, b) => a + b, 0) + rs_current_payment * 1.2 >
        rs_hurdle
    ) {
      rs_payment_array.push(
          rs_hurdle - rs_payment_array.reduce((a, b) => a + b, 0)
      );
    } else {
      rs_payment_array.push(rs_current_payment);
    }
    current_revenue = current_revenue * (1 + rs_growth);
    rs_current_payment = current_revenue / 12;
  }
  // get longer of loan payment or RS period
  let periods = Math.max(rs_payment_array.length, payments);
  //set start and stop dates
  let now = new Date();
  if (now.getMonth() == 11) {
    var nextMonth = new Date(now.getFullYear() + 1, 0, 1);
    var stopMonth = new Date(
        new Date(now.getFullYear() + 1, 0, 1).setMonth(
            nextMonth.getMonth() + periods
        )
    );
  } else {
    let nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    let stopMonth = new Date(
        new Date(now.getFullYear() + 1, 0, 1).setMonth(
            nextMonth.getMonth() + periods
        )
    );
  }
  //LOAN CALCULATIONS
  // compute monthly payment figure
  let x = Math.pow(1 + interest, payments);
  let monthly = principal * x * interest / (x - 1);
  let loan_payment_array = [];
  for (i = 0; i < payments; i++) {
    loan_payment_array.push(monthly);
  }

  let date_array = getDates(nextMonth, stopMonth);

  let superData = [];
  for (index = 0; index < date_array.length; index++) {
    superData.push({
      date: date_array[index].toLocaleDateString("fr-CA"),
      lp: Object.is(loan_payment_array[index], undefined) ? 0 : loan_payment_array[index],
      rsp: Object.is(rs_payment_array[index], undefined) ? 0 : rs_payment_array[index]
    })
  }
  return superData;
}
//get array of dates between start and stop dates
function getDates(startDate, stopDate) {
  let dateArray = [];
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addMonths(1);
  }
  return dateArray;
}
