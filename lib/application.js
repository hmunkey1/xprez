'use strict';

import Express from 'express';
import path from 'path';
import ejs from 'ejs';

import router from './middlewares/router';
import load from './loader';
import { Controller, Service } from './modules';

class Application extends Express {

  /**
   * App constructor.
   * 
   * Binds all user objects, controllers, config and services to 
   * app object. Also sets view engine and view folder
   * 
   * @constructor
   * @param {string} folderPath Path to the `src` folder
   * @param {object} binds A set of objects user would like to access in Controllers & Services
   */
  constructor(folderPath, binds = {}) {
    super();

    this.userBindings = binds;
    this.env = process.env.NODE_ENV || 'development';

    const hash = {
      '../config': (this.config = {}),
      '../app/services': (this.services = {}),
      '../app/controllers': (this.controllers = {})
    };

    Object.keys(hash).forEach((folder, index) => {
      load(path.join(folderPath, folder)).forEach((item) => {
        hash[folder][item.name] = index === 0 ? item.module : new (item.module)(this);
      });
    });

    this.set('view engine', 'ejs');
    this.set('views', path.join(folderPath, '../app/views'));

    this.use(router(this, folderPath));
  }
}

export {
  Application as App,
  Controller,
  Service
};
