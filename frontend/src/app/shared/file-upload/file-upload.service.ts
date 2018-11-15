import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FetchResult } from 'apollo-link';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';

import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/shared/auth.service';

const SINGLE_UPLOAD = gql`
  mutation ($id: Int!, $personPatch: PersonPatch!) {
    updatePersonById(input: {id: $id, personPatch: $personPatch}) {
      person {
        id
      }
    }
  }
`;

const MULTIPLE_UPLOAD = gql`
  mutation multipleUpload($text: String, $files: [Upload!]!) {
    multipleUpload(text: $text, files: $files) {
      id
      filename
    }
  }
`;

const UPLOADS = gql`
  query uploads {
    uploads {
      id
      filename
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  userId: number;
  constructor(private apollo: Apollo, private authService: AuthService) {
    this.authService.currentUser.subscribe(user => this.userId = user.id);
  }

  public upload(files: FileList): Observable<FetchResult> {
    if (files.length > 1) {
      const fileArray = Array.from(files);
      // return this.mutipleUpload(files);
      return this.multipleUpload(fileArray);
    }
    return this.apollo
      .mutate({
        mutation: SINGLE_UPLOAD,
        variables: {
          id: this.userId,
          personPatch: { avatarUrl: files[0] }
        }
      })
      .pipe(map(res => {
        return res;
      }));
  }

  public multipleUpload(files: FileList | File[]): Observable<FetchResult> {
    return this.apollo
      .mutate({
        mutation: MULTIPLE_UPLOAD,
        variables: {
          text: '123',
          files
        }
      })
      .pipe(map(res => {
        return res;
      }));
  }

  public queryAll(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({ query: UPLOADS }).valueChanges;
  }
}
