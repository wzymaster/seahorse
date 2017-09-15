/**
 * Copyright 2015 deepsense.ai (CodiLime, Inc)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.deepsense.deeplang.params

import spray.json.JsValue

import ai.deepsense.deeplang.exceptions.DeepLangException
import ai.deepsense.deeplang.params.validators.Validator

trait HasValidator[T] extends Param[T] {

  val validator: Validator[T]

  override def validate(value: T): Vector[DeepLangException] = validator.validate(name, value)

  override def constraints: String =
    if (validator.toHumanReadable(name).isEmpty) {
      ""
    } else {
      " " + validator.toHumanReadable(name)
    }

  override protected def extraJsFields: Map[String, JsValue] =
    super.extraJsFields ++ Map("validator" -> validator.toJson)
}
