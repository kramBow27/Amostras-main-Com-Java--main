Código Comentado para não ficar com erro por missing imports

router.post('/jobs/new/csv/upload', upload, async (request, response) =>
{ 
  interface IJobConfig {
          guid: string;
          data_source_type_key?: string;
          data_source_config?: IObject;
          data_source_account_uid?: string;
          data_source_columns?: IColumn[];
          action_type_key?: string;
          action_config?: IObject;
          action_account_uid?: string;
   
  }
  

      
  
  
  
  switch (request.body.step) {
    case 'data-source-config':
      {
      
     
        const job_config = request.session.job_config as IJobConfig;

        const file = request.file as Express.MulterS3.File;
        // Agora deveria funcionar
       

        if (!file) {
          return response.status(400).send({ message: 'Nenhum arquivo foi enviado.' });
        }

        const fileStream  = await getFileStream(file.bucket, file.key);
       
        
       
       const s3_key = file.key;
  
        const uploadedFile: IUploadedFile = {
           id: generateRandomNumber(8),
          user_id: request.currentSession.user_id,
          name: file.originalname,
          content_type: file.mimetype,
          size: file.size,
          s3_key: s3_key,
          created_at: new Date(),
          job_uid: job_config.guid
  
        };

        

        db.uploadedFile.createFile(uploadedFile);
             
        
        const data_source_type = new CsvDataSourceType();
          
        const locals = {
          ...request.body,
          job_config: job_config,
          file: fileStream
        };
      
        
           
           
        const data_source = new CsvDataSource();
             

        const data_source_config = uploadedFile;
      
        
       

        try {
          await data_source.load(fileStream);
        } catch (error) {
          log.warning('Cannot load data source', {
            error: error,
            job_config: job_config,
            request: request,
          });

          if (error instanceof DataSourceError) {
            return response.render(
              `app/jobs-new-data-source-config-${data_source_type.configViewName}`,
              {
                ...(await getSharedLocals(request)),
                ...locals,
                error: error.message,
              }
            );
          }

          return response.render(
            `app/jobs-new-data-source-config-${data_source_type.configViewName}`,
            {
              ...(await getSharedLocals(request)),
              ...locals,
              error: `Unknown error.`,
            }
          );
        }

        const columns = data_source.getColumns();
       

        if (columns.length === 0) {
          log.warning('Data source has no columns', {
            job_config: job_config,
            request: request,
          });

          return response.render(
            `app/jobs-new-data-source-config-${data_source_type.configViewName}`,
            {
              ...(await getSharedLocals(request)),
              ...locals,
              error: `This spreadsheet has no columns.`,
            }
          );
        }

        const row_count = data_source.getRowCount();

        if (row_count === 0) {
          log.warning('Data source has no rows', {
            job_config: job_config,
            request: request,
          });

          return response.render(
            `app/jobs-new-data-source-config-${data_source_type.configViewName}`,
            {
              ...(await getSharedLocals(request)),
              ...locals,
              error: `This spreadsheet has no data.`,
            }
          );
        }

        if (row_count > config.core.max_spreadsheet_row_count) {
          log.warning(`Data source too big (${row_count} rows)`, {
            job_config: job_config,
            request: request,
          });

          return response.render(
            `app/jobs-new-data-source-config-${data_source_type.configViewName}`,
            {
              ...(await getSharedLocals(request)),
              ...locals,
              error: `PostSheet currently supports spreadsheets with less than ${config.core.max_spreadsheet_row_count} rows only.`,
            }
          );
        }

        const rows = data_source.getRows();
        

        job_config.data_source_config = data_source_config;
        job_config.data_source_columns = columns;
      
        const action_types = core.getActionTypes();
        const user_accounts = await db.account.getAccountsByUserId(
          request.currentSession?.user?.id
        );
        const action_choices = getActionChoices(action_types, user_accounts);
        const available_action_types = getAvailableActionTypes(
          action_types,
          user_accounts
        );

        slack.notify(
          `:heavy_plus_sign: New Job: Data source configured (${data_source_type.key} / ${rows.length} rows)`,
          request.currentSession
        );
        request.session.fileStream = fileStream;
       
        //OBTER O S3 DENTRO DO MÉTODO LOAD. VERIFICAR USUÁRIO LOGADO, ENTÃO QUAL FOI O ULTIMO ARQUIVO A SER ENVIADO, E ENTÃO FAZER A LEITURA DESTE

        response.render(`app/jobs-new-action`, {
          ...(await getSharedLocals(request)),
          job_config: job_config,
          file: fileStream,
          action_choices: action_choices,
          available_action_types: available_action_types,
        });

      }
      break;
     case 'action':
      {
            
        const params = {
          job_config: JSON.parse(
            Buffer.from(request.body.job_config, 'base64').toString()
          ) as IJobConfig,
          action_type_key: request.body.action_choice.split(':')[0],
          action_account_uid: request.body.action_choice.split(':')[1],
        };

        const action_types = core.getActionTypes();
        const user_accounts = await db.account.getAccountsByUserId(
          request.currentSession?.user?.id
        );
        const action_choices = getActionChoices(action_types, user_accounts);
        const available_action_types = getAvailableActionTypes(
          action_types,
          user_accounts
        );

        const locals = {
          ...request.body,
          job_config: params.job_config,
          file: request.session.fileStream,
          action_choices: action_choices,
          available_action_types: available_action_types,
        };
  
        const job_config = params.job_config;

        const action_type = core.getActionType(params.action_type_key);

        if (!action_type) {
          return response.render('app/jobs-new-action', {
            ...(await getSharedLocals(request)),
            ...locals,
            error: `Invalid action.`,
          });
        }

        job_config.action_type_key = action_type.key;

        if (action_type.requiresAccountType) {
          // tslint:disable-next-line: no-var-keyword
          var action_account = await db.account.getAccountByUid(
            params.action_account_uid
          );

          if (
            !action_account ||
            action_account.type !== action_type.requiresAccountType
          ) {
            return response.render('app/jobs-new-action', {
              ...(await getSharedLocals(request)),
              ...locals,
              error: `Invalid action.`,
            });
          }

          job_config.action_account_uid = action_account.uid;
        }

        slack.notify(
          `:heavy_plus_sign: New Job: Action selected (${params.action_type_key})`,
          request.currentSession
        );

        response.render('app/jobs-new-action-config', {
          ...(await getSharedLocals(request)),
          job_config: job_config,
          file: request.session.fileStream,
          config_view_name: action_type.configViewName,
          ...action_type.getLocals(action_account),
        });
      }
      break;

    case 'action-config':
  
      {     
        
        const uploadedFileParams =await db.uploadedFile.getUploadedFilesByJobUid(request.session.job_config.guid);
        
        const fileStream = await downloadFileAsStream(uploadedFileParams.s3_key);
      
       
        type ParamsType = {
          job_config: IJobConfig;
          ignore_validation_errors: boolean;
        };

        const params: ParamsType = {
          job_config: JSON.parse(
            Buffer.from(request.body.job_config, 'base64').toString()
          ) as IJobConfig,
          ignore_validation_errors:
            request.body.ignore_validation_errors === 'true',
        };

         
        const locals = {
          ...request.body,
          file: request.session.fileStream,
          job_config: params.job_config,
        };
      
        const job_config = params.job_config;
       

        const action_type = core.getActionType(job_config.action_type_key);
        const action_params = action_type.getParams(request.body);
 
        const error = action_type.validate(action_params);
      

        if (error) {
          log.warning(`Invalid action config (${error})`, {
            job_config: job_config,
            request: request,
          });

          return response.render('app/jobs-new-action-config', {
            ...(await getSharedLocals(request)),
            ...locals,
            config_view_name: action_type.configViewName,
            error: error,
          });
        }

       

        let links = [];
        if (job_config.action_type_key !== 'twilio.send-sms') {
          const domTree = parse(request.body.body_html);
          links = domTree.querySelectorAll('a');
        } else {
          console.log('Skipping HTML parsing for twilio.send-sms');
        }

        if (links.length > 5) {
          const error = "Can't add more than 5 links.";

          log.warning(`Invalid action config (${error})`, {
            job_config: job_config,
            request: request,
          });

          return response.render('app/jobs-new-action-config', {
            ...(await getSharedLocals(request)),
            ...locals,
            config_view_name: action_type.configViewName,
            error: error,
          });
        } else if (job_config.action_type_key === 'twilio.send-sms') {
          request.body.body_html = '';
        }
        
        
     
        const data_source = new CsvDataSource()
         
        await data_source.load(fileStream);

        const columns = data_source.getColumns();
        const rows = data_source.getRows();

        const action_config = action_type.getConfig(action_params);

        const actions = rows.map((row) =>
          action_type.createAction(action_config, columns, row)
        );

        if (!params.ignore_validation_errors) {
          const errors = actions
            .map((action) => action_type.validateAction(action))
            .filter((error) => !!error);

          for (const error of errors)
            error.row_url = error.action.row.key;

          if (errors.length !== 0) {
            log.warning(`Invalid actions (${errors.length})`, {
              job_config: job_config,
              request: request,
            });

            return response.render(`app/jobs-new-error`, {
              ...(await getSharedLocals(request)),
              errors: errors,
              data_source_url: '.Csv file',
              body: request.body,
            });
          }
        }

        job_config.action_config = action_config;

        slack.notify(
          `:heavy_plus_sign: New Job: Action configured (${action_type.key})`,
          request.currentSession
        );

        response.render('app/jobs-new-preview', {
          ...(await getSharedLocals(request)),
          ...locals,
          job_config: job_config,
          preview_view_name: action_type.previewViewName,
          items: actions.slice(0, 3),
          file: locals.file,
          total_item_count: actions.length,
        });
      }
      break;

    case 'preview':
      {
        const uploadedFileParams = await db.uploadedFile.getUploadedFilesByJobUid(request.session.job_config.guid);
      
        const fileStream = await downloadFileAsStream(uploadedFileParams.s3_key);
       
        const params = {
          job_config: JSON.parse(
            Buffer.from(request.body.job_config, 'base64').toString()
          ) as IJobConfig,
        };

        const job_config = params.job_config;
     
        if (job_config.data_source_account_uid) {
          // tslint:disable-next-line: no-var-keyword
          var data_source_account = await db.account.getAccountByUid(
            job_config.data_source_account_uid
          );

          if (
            !data_source_account ||
            data_source_account.user_id !== request.currentSession?.user?.id
          )
            return response.status(403).end();
        }

        if (job_config.action_account_uid) {
          // tslint:disable-next-line: no-var-keyword
          var action_account = await db.account.getAccountByUid(
            job_config.action_account_uid
          );

          if (
            !action_account ||
            action_account.user_id !== request.currentSession?.user?.id
          )
            return response.status(403).end();
        }

     
        const data_source = new CsvDataSource()
     

        await data_source.load(fileStream);

        const columns = data_source.getColumns();
        const rows = data_source.getRows();

        const product = db.plan.getProductByPlanId(
          request.currentSession.user?.plan_id
        );
        const total_job_item_count = await db.job.getJobItemCountByUserId(
          request.currentSession?.user?.id,
          dateFns.startOfMonth(new Date()),
          dateFns.endOfMonth(new Date())
        );

        if (rows.length + total_job_item_count > product.quota) {
          log.warning(`Quota exceeded`, {
            quota_total: product.quota,
            quota_used: total_job_item_count,
            quota_required: rows.length,
            job_config: job_config,
            request: request,
          });

          return response.render('app/jobs-new-upgrade', {
            ...(await getSharedLocals(request)),
            product: product,
            total_job_item_count: total_job_item_count,
            job_row_count: rows.length,
          });
        }

      

        const job = await db.job.createJob({
          uid: util.generateRandomString(32),
          user_id: request.currentSession?.user?.id,
          session_id: request.currentSession?.id,
          name: `Job #${
            (await db.job.getJobsByUserIdCount(
              request.currentSession?.user?.id
            )) + 1
          }`,
          data_source_type: job_config.data_source_type_key,
          data_source_config: job_config.data_source_config,
          data_source_account_id: data_source_account?.id,
          data_source_columns: columns,
          action_type: job_config.action_type_key,
          action_config: job_config.action_config,
          action_account_id: action_account?.id,
          on_error: 'pause',
          creation_date_time: new Date(),
          stats_total: rows.length,
          stats_succeeded: 0,
          stats_failed: 0,
          stats_unsubscribed: 0,
          state: 'initializing',
        });