import { trigger, transition, style, animate } from '@angular/animations';

export const registroAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms', style({ opacity: 0 }))
  ])
]);
