import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type FrogEntry = { question: string; answer: string; askedAt: string };
type FrogMode = 'normal' | 'superFrog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  question = '';
  latestAnswer = '';
  isThinking = false;
  history: FrogEntry[] = [];
  currentMode: FrogMode = 'normal';

  private readonly storageKey = 'froggpt.questionHistory';

  private readonly normalFrogNoises = [
    'Ribbit!',
    'Croooak...',
    'Grrribbit!',
    'Rib-rib-ribbit!',
    'Brrroaak!',
    'Croak? Ribbit.',
    'Rrribbit ribbit!',
    'Gloop... ribbit!',
    'Brekekekex koax koax!',
    'Re-bit',
    'Croak-croak!',
    'Gribbit?',
    'Hrrr-onk',
    '*Ribbit...*',
    'Baaar-oop!',
    'Mmm-croak.',
    'Chug-a-rum!',
    'Wrrk...',
    'Bloop-ribbit.',
    'Croakity croak!',
  ];

  private readonly superFrogResponses = [
    'RIBBBBBBIT RIBBBBBBIT RIBBBBBBIT!!! Croooak croooak! Grrribbit grrribbit grrribbit! RIBBBBBBBBBBBBBBBIT! Croak? Ribbit. CROOOOOAK! Rib-rib-rib-ribbit ribbit ribbit! Brrroaak brrroaak! GRRRIBBIT!!!',

    'CROOOOAAAAK!!! RIBBIT RIBBIT RIBBIT!!! Croak croak croak croak! GRRRIBBBBBBBBIT! Rib-rib-rib-rib-RIBBIT! CROOOAK CROOOAK! Brekekekex koax koax koax! RIBBBBBBBBBBBBIT! Croak-croak-croak!',

    'GRRRIBBIT?! RIBBIT TO THE MAX!!! CROOOOOAK CROOOOOAK! Gribbit gribbit! Ribbit ribbit ribbit ribbit RIBBIT! Hrrr-onk hrrr-onk hrrr-onk! Baaar-oop baaar-oop! CROAK CROAK CROAK! Rrribbit rrribbit rrribbit!',

    'MEGA CROAK MEGA CROAK!!! RIBBBBBBBBBBBBBBBIT! Croooak grrribbit ribbit! Chug-a-rum chug-a-rum! CROOOOAAAAAAAK! Gribbit gribbit gribbit! Wrrk wrrk wrrk RIBBIT! Bloop-ribbit bloop-ribbit! CROAKITY CROAK CROAK!',

    'RIBBBBBBBBBBBBBBBBBBBBBBBBIT!!! CROOOOOOOOOOOOAAAAAAAK! Grrribbit! Ribbit ribbit ribbit! CROAK CROAK CROAK CROAK! Rrribbit rrribbit rrribbit! Hrrr-onk! Brekekekex KOAX KOAX KOAX! GRRRIBBBBBBIT GRRRIBBBBBBIT!',

    'ULTIMATE RIBBIT!!! CROOOOOAK CROOOOOAK! Gribbit gribbit gribbit RIBBIT! BRRROAAAAK! Croak-croak-croak-croak! Rib-rib-rib-rib-ribbit! GRRRIBBIT GRRRIBBIT GRRRIBBIT! Croakity-croak croak croak! RIBBBBBBBBBBIT!',

    'FROG FURY FURY FURY!!! CROAAAAAAAAK! Ribbit ribbit ribbit ribbit ribbit! GRRRIBBBBBBBBBBBBBBIT! Croak croak croak! Brrroaak brrroaak! Rrribbit rrribbit! CROOOOAAAAK! Gribbit gribbit gribbit! MEGA RIBBIT RIBBIT!',

    'CROOOOAAAAAAAAAAAAAAAK CROOOOAAAAAAAAAAAAAAAK!!! RIBBIT RIBBIT RIBBIT RIBBIT! Grrribbit grrribbit! BRRRRROAAAAAAAK! Croak-croak-croak-croak! Rib-rib-rib-ribbit! GRRRIBBBBBBBBBBBBIT! Croooak croooak croooak! ULTIMATE FROG CROAAAAAAK!',
  ];

  constructor(private cdr: ChangeDetectorRef) {
    this.loadHistory();
  }

  askFrog(): void {
    const trimmedQuestion = this.question.trim();
    if (!trimmedQuestion || this.isThinking) return;

    this.isThinking = true;
    this.latestAnswer = '';

    const thinkTime = Math.floor(Math.random() * 1500) + 700;

    setTimeout(() => {
      try {
        const answer = this.randomNoise();
        this.latestAnswer = answer;
        const entry: FrogEntry = {
          question: trimmedQuestion,
          answer,
          askedAt: new Date().toISOString(),
        };
        this.history.unshift(entry);
        this.saveHistory();
      } catch (e) {
        console.error('Error saving history', e);
      } finally {
        this.question = '';
        this.isThinking = false;
        this.cdr.detectChanges();
      }
    }, thinkTime);
  }

  clearHistory(): void {
    this.history = [];
    localStorage.removeItem(this.storageKey);
  }

  toggleMode(): void {
    this.currentMode = this.currentMode === 'normal' ? 'superFrog' : 'normal';
  }

  private randomNoise(): string {
    if (this.currentMode === 'superFrog') {
      return this.superFrogResponses[Math.floor(Math.random() * this.superFrogResponses.length)];
    }
    return this.normalFrogNoises[Math.floor(Math.random() * this.normalFrogNoises.length)];
  }

  private saveHistory(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.history));
  }

  private loadHistory(): void {
    try {
      const parsed = JSON.parse(localStorage.getItem(this.storageKey) || 'null');
      if (Array.isArray(parsed)) this.history = parsed;
    } catch {
      this.history = [];
    }
  }
}
