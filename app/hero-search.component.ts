import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './Hero';

@Component({
  moduleId: module.id,
  selector: 'hero-search',
  templateUrl: 'hero-search.component.html',
  styleUrls: [ 'hero-search.component.css' ],
  providers: [ HeroSearchService ]
})
export class HeroSearchComponent {
  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  //////
  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300) // wait for 300 ms pause in events
      .distinctUntilChanged() // ignore if next search term is same as previous
      .switchMap(term => term ? this.heroSearchService.search(term) : Observable.of<Hero[]>([]))
      .catch(error => {
        console.log(error); // TODO: real error handling
        return Observable.of<Hero[]>([]);
      })
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }
}