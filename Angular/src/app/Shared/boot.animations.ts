import { animate, style, transition, trigger } from "@angular/core";

export const bootStateTrigger = trigger('bootState', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate('200ms', style({
      opacity: 1
    }))
  ]),
  transition(':leave', [
    style({
      opacity: 0
    }),
    animate('200ms', style({
      opacity: 1
    }))
  ])
]);
