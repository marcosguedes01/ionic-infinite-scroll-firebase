import { TestBed, inject } from '@angular/core/testing';

import { FirebaseDatabaseService } from './firebase-database.service';
import { Post } from '../models/post';

describe('FirebaseDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseDatabaseService = TestBed.get(FirebaseDatabaseService);
    expect(service).toBeTruthy();
  });

  it('should load posts', done => {
    inject([FirebaseDatabaseService], function(database: FirebaseDatabaseService){
      database.getPosts().then(function(result:Array<Post>){
        expect(result.length > 0).toBe(true);
        done();
      });      
    })();    
  });
});
