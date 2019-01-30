import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../auth/shared/auth.service';
import gql from 'graphql-tag';

@Component({
  selector: 'app-post-category',
  templateUrl: './post-category.component.html',
  styleUrls: ['./post-category.component.scss']
})
export class PostCategoryComponent implements OnInit {

  nodes = [
    /* {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    } */
  ];
  options = {};
  constructor(
    private apollo: Apollo,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.apollo.query({
      query: gql(`query {
        allPostCategories {
          edges {
            node {
              id,
              name,
              parentPath,
              parentId
            }
          }
        }
      }`)
    }).subscribe((result: any) => {
      const postCategories = result.data.allPostCategories.edges;

      console.log(result);
      const all = {},
        out = {
          'id': '',
          'name': 'root',
          'children': []
        };
      let r, i;
      for (i = 0; i < postCategories.length; i++) {
        r = postCategories[i];
        r.children = [];
        all[r.node.id] = r;
        if (r.node.parentId == null) {
          out.children.push(r.node);
        }
      }

      for (i = 0; i < postCategories.length; i++) {
        r = postCategories[i];
        if (all[r.node.parentId]) {
          all[r.node.parentId].children.push(r.node);
        }
      }

      this.nodes = [out];
    });
  }

}
