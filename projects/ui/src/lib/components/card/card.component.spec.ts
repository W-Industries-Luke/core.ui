import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `
    <core-card [title]="title">
      <p class="content">Body content</p>
    </core-card>
  `,
})
class HostComponent {
  title = '';
}

describe('CardComponent', () => {
  function render(title: string) {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.title = title;
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('projects content into the card body', () => {
    const el = render('');

    expect(el.querySelector('.core-card-body .content')?.textContent).toBe('Body content');
  });

  it('renders a header when a title is set', () => {
    const el = render('Session');

    expect(el.querySelector('.core-card-header')?.textContent).toBe('Session');
  });

  it('omits the header without a title', () => {
    const el = render('');

    expect(el.querySelector('.core-card-header')).toBeNull();
  });
});
