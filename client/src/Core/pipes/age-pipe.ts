import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: string | Date): number {
    if (!value) {
      console.warn('AgePipe: No value provided.');
      return 0;
    }

    console.log('Raw input value:', value);

    const dob = new Date(value);
    console.log('Parsed Date object:', dob);

    if (isNaN(dob.getTime())) {
      console.error('Invalid date format for AgePipe:', value);
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    console.log('Today:', today);
    console.log('Month diff:', monthDiff);

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
      console.log('Birthday not reached this year, adjusted age:', age);
    }

    console.log('Final calculated age:', age);

    return age;
  }

}
